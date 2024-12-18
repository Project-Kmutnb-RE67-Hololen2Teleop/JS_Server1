import cv2
import time
import websocket
import signal
import sys
import ssl
import threading

# Define server address
SERVER_ADDRESS = "wss://192.168.0.185:12345"  # Replace with your server's address

# Initialize camera
camera = cv2.VideoCapture(0)
if not camera.isOpened():
    print("Error: Could not open camera")
    sys.exit(1)

# WebSocket connection
def on_open(ws):
    print("Connected to server")

def on_error(ws, error):
    print(f"WebSocket error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("WebSocket connection closed")

# Define WebSocket object with sslopt
ws = websocket.WebSocketApp(
    SERVER_ADDRESS,
    on_open=on_open,
    on_error=on_error,
    on_close=on_close,
)

def send_frames():
    frame_count = 0
    start_time = time.time()

    # Frame parameters
    target_width = 480  # Smaller size for faster processing
    target_height = 480
    jpeg_quality = 60  # Lower quality for faster encoding
    fps_limit = 30
    frame_delay = 1/fps_limit

    last_time = time.time()

    while True:
        ret, frame = camera.read()
        if not ret:
            print("Failed to grab frame")
            break

        # Resize frame
        frame = cv2.resize(frame, (target_width, target_height))

        # Encode frame as JPEG
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), jpeg_quality]
        success, buffer = cv2.imencode('.jpg', frame, encode_param)
        if success:
            try:
                size = len(buffer)
                ws.send(size.to_bytes(4, byteorder="big"), opcode=websocket.ABNF.OPCODE_BINARY)
                ws.send(buffer.tobytes(), opcode=websocket.ABNF.OPCODE_BINARY)
            except Exception as e:
                print(f"Error sending frame: {e}")
                break

        # Calculate FPS and delay
        frame_count += 1
        current_time = time.time()
        elapsed = current_time - last_time
        
        time.sleep(frame_delay)
        last_time = current_time

        # Print FPS every second
        if time.time() - start_time >= 1.0:
            print(f"FPS: {frame_count}")
            frame_count = 0
            start_time = time.time()

        # Break if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# Graceful shutdown
def shutdown(signal, frame):
    print("Shutting down...")
    camera.release()
    cv2.destroyAllWindows()
    ws.close()
    sys.exit(0)

signal.signal(signal.SIGINT, shutdown)

# Run WebSocket connection in a thread with sslopt
ws_thread = threading.Thread(
    target=lambda: ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
)
ws_thread.start()

# Send frames to the server
send_frames()

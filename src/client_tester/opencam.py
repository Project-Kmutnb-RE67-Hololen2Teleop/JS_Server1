import cv2
import time
import websocket
import signal
import sys
import ssl
import threading

# Define server address
SERVER_ADDRESS = "wss://192.168.1.107:12345"

# Initialize camera
camera = cv2.VideoCapture(0)
if not camera.isOpened():
    print("Error: Could not open camera")
    sys.exit(1)

# WebSocket Callbacks
def on_open(ws):
    print("Connected to server")

def on_message(ws, message):
    print(f"Received from server: {message}")

def on_error(ws, error):
    print(f"WebSocket error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("WebSocket connection closed, attempting to reconnect...")
    reconnect()

# ฟังก์ชันเชื่อมต่อ WebSocket ใหม่อัตโนมัติ
def reconnect():
    global ws
    while True:
        try:
            print("Reconnecting to WebSocket server...")
            ws = websocket.WebSocketApp(
                SERVER_ADDRESS,
                on_open=on_open,
                on_message=on_message,
                on_error=on_error,
                on_close=on_close,
            )
            ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})  # รัน WebSocket
            break  # ถ้าต่อสำเร็จ ออกจากลูป
        except Exception as e:
            print(f"Reconnect failed: {e}, retrying in 5 seconds...")
            time.sleep(5)  # รอ 5 วินาทีก่อนลองใหม่

# สร้าง WebSocket App
ws = websocket.WebSocketApp(
    SERVER_ADDRESS,
    on_open=on_open,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close,
)

# ฟังก์ชันส่งเฟรมไปยังเซิร์ฟเวอร์
def send_frames():
    frame_count = 0
    start_time = time.time()

    target_width = 720  
    target_height = 480
    jpeg_quality = 80  
    fps_limit = 30
    frame_delay = 1 / fps_limit

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
                # ตรวจสอบว่า WebSocket ยังเชื่อมต่ออยู่ก่อนส่งข้อมูล
                if not ws.sock or not ws.sock.connected:
                    print("WebSocket is not connected, waiting for reconnection...")
                    time.sleep(1)  # รอ 1 วินาที แล้วลองใหม่
                    continue  # ไม่ `break` ออกจากลูป แต่รอ WebSocket กลับมา

                size = len(buffer)
                ws.send(size.to_bytes(4, byteorder="big"), opcode=websocket.ABNF.OPCODE_BINARY)
                ws.send(buffer.tobytes(), opcode=websocket.ABNF.OPCODE_BINARY)
            except Exception as e:
                print(f"Error sending frame: {e}")
                time.sleep(1)  # รอ 1 วินาที แล้วลองใหม่
                continue  # ไม่ `break` ออกจากลูป

        # คำนวณ FPS
        frame_count += 1
        current_time = time.time()
        elapsed = current_time - last_time
        time.sleep(frame_delay)
        last_time = current_time

        # Print FPS ทุก 1 วินาที
        if time.time() - start_time >= 1.0:
            print(f"FPS: {frame_count}")
            frame_count = 0
            start_time = time.time()

        # หยุดการทำงานเมื่อกด 'q'
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

# รัน WebSocket ในเธรดแยก
ws_thread = threading.Thread(
    target=lambda: ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
)
ws_thread.start()

# ส่งเฟรมไปยังเซิร์ฟเวอร์
send_frames()

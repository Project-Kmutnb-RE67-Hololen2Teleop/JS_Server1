import httpx
import cv2
import numpy as np

# Define the API endpoint
url = "https://192.168.1.105:12345/2D_images"  # Replace with your actual endpoint

# Fetch image buffer from the endpoint
with httpx.Client(http2=True, verify=False) as client:
    while True:
        try:
            # Fetch image data from the endpoint
            response = client.get(url)

            # Check if the request was successful
            if response.status_code == 200:
                # Convert the received data (buffer) to a numpy array
                np_array = np.frombuffer(response.content, dtype=np.uint8)

                # Decode the image into an actual image format
                image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

                # Check if image was successfully decoded
                if image is not None:
                    # Show the image in an OpenCV window
                    cv2.imshow("Received Image", image)

                    # Wait for a key press to close the window
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                else:
                    print("Failed to decode the image")
            else:
                print(f"Failed to fetch image: {response.status_code}")
        
        except httpx.RequestError as e:
            print(f"An error occurred while requesting the image: {e}")
        
        except Exception as e:
            print(f"Unexpected error: {e}")

# Release resources and close the window
cv2.destroyAllWindows()
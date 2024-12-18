import httpx

# Define the API endpoint and output file path
url = "https://192.168.0.185:12345/2D_images"  # Replace with the actual endpoint
output_file = "2D_image.jpg"           # Desired file name for the image

# Fetch image buffer from the endpoint
with httpx.Client(http2=True, verify=False) as client:
    response = client.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Save the image buffer to a file
        with open(output_file, "wb") as file:
            file.write(response.content)
        print(f"Image saved as {output_file}")
    else:
        print(f"Failed to fetch image: {response.status_code}")
import cv2
import numpy as np

# Load image
image = cv2.imread("passportphoto.jpeg")

# Convert to RGB
img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Load Haarcascade face detector
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

# Detect face
faces = face_cascade.detectMultiScale(
    cv2.cvtColor(image, cv2.COLOR_BGR2GRAY),
    scaleFactor=1.3,
    minNeighbors=5
)

# If face detected
for (x, y, w, h) in faces:

    # Expand region for hair and shoulders
    x1 = max(x - int(w * 0.5), 0)
    y1 = max(y - int(h * 1.0), 0)
    x2 = min(x + int(w * 1.5), image.shape[1])
    y2 = min(y + int(h * 2.5), image.shape[0])

    roi = image[y1:y2, x1:x2]

    # Create mask for segmentation
    mask = np.zeros(roi.shape[:2], np.uint8)

    bgModel = np.zeros((1, 65), np.float64)
    fgModel = np.zeros((1, 65), np.float64)

    rect = (1, 1, roi.shape[1]-2, roi.shape[0]-2)

    # GrabCut segmentation
    cv2.grabCut(roi, mask, rect, bgModel, fgModel, 5, cv2.GC_INIT_WITH_RECT)

    # Convert mask
    mask2 = np.where((mask==2)|(mask==0),0,1).astype('uint8')

    # Extract foreground
    foreground = roi * mask2[:,:,np.newaxis]

    # Create white background
    white_bg = np.ones_like(roi, dtype=np.uint8) * 255

    # Combine foreground + white background
    result = np.where(mask2[:,:,np.newaxis]==1, foreground, white_bg)

    # Replace ROI
    image[y1:y2, x1:x2] = result

# Save output
cv2.imwrite("passport_white_bg.jpg", image)

print("Passport image processed successfully.")
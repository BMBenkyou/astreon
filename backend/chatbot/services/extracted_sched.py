import cv2
import pytesseract

# Load the image
image_path = "./schedule.png"
image = cv2.imread(image_path)

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply adaptive thresholding (better for complex images)
adaptive_thresh = cv2.adaptiveThreshold(
    gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
)

# Optional: Denoising (if needed)
denoised = cv2.fastNlMeansDenoising(adaptive_thresh, None, 30, 7, 21)

# Save processed image for debugging
cv2.imwrite("processed_schedule.png", denoised)

# OCR with Pytesseract
custom_config = r'--psm 6'  # Assume uniform blocks of text
raw_text = pytesseract.image_to_string(denoised, config=custom_config)

# Print raw OCR output
print("Raw OCR Output:")
print(raw_text)

import cv2

def check_camera():
    for i in range(5):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            print(f"카메라 {i}번 사용가능")
            cap.release()
        else:
            print(f"카메라 {i}번은 사용불가")

check_camera()

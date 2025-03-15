import os
from datetime import datetime
from selenium import webdriver  # type: ignore
from selenium.webdriver.chrome.service import Service as ChromeService  # type: ignore
from selenium.webdriver.support.ui import WebDriverWait  # type: ignore
from selenium.webdriver.support import expected_conditions as EC  # type: ignore
from selenium.webdriver.common.by import By  # type: ignore


class SeleniumUtil:

    @staticmethod
    def initialize_driver():
        service = ChromeService()
        driver = webdriver.Chrome(service=service)
        return driver

    @staticmethod
    def open_page(driver, url):
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        driver.maximize_window()

    @staticmethod
    def close_driver(driver):
        if driver:
            driver.quit()

    @staticmethod
    def take_screenshot(driver, test_kind, folder, name):
        project_root = SeleniumUtil.get_project_root()
        screenshot_dir = os.path.join(
            project_root, "integrationTest", "evidence", test_kind, folder
        )
        if not os.path.exists(screenshot_dir):
            os.makedirs(screenshot_dir)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{name}_{timestamp}.png"
        filepath = os.path.join(screenshot_dir, filename)
        driver.save_screenshot(filepath)
        print(f"スクリーンショットを保存しました: {filepath}")

    def get_project_root():
        """プロジェクトのルートディレクトリを返す"""
        current_path = os.path.abspath(__file__)
        while not os.path.exists(os.path.join(current_path, "integrationTest")):
            current_path = os.path.dirname(current_path)
        return current_path

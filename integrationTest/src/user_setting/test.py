from src.utils.selenium_util import SeleniumUtil
from src.utils.constants import SUPERUSER_EMAIL, SUPERUSER_PASSWORD
from selenium.webdriver.common.by import By  # type: ignore
from selenium.webdriver.support.ui import WebDriverWait  # type: ignore
from selenium.webdriver.support import expected_conditions as EC  # type: ignore

""" python -m pytest src/user_setting/test.py """


class TestUserSettingPage:
    """項番1. ユーザ設定画面が表示されること"""

    def test_user_setting1(self):
        driver = SeleniumUtil.initialize_driver()

        SeleniumUtil.open_page(driver, "http://localhost:3000")

        try:
            TestUserSettingPage.login(driver)

            user_setting_element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        "//*[@id='__nuxt']/div[2]/main/div[2]/section/div[3]/div/div/p[5]",
                    )
                )
            )

            user_setting_element.click()

            WebDriverWait(driver, 10).until(EC.title_contains("ユーザ設定"))

            SeleniumUtil.take_screenshot(
                driver, "user_setting", "項番1", "ユーザ設定画面"
            )

        except Exception as e:
            print(f"項番1. ユーザ設定画面が表示されること : {e}")

        finally:
            SeleniumUtil.close_driver(driver)

    """ 項番2. 戻るボタンでホーム画面に遷移すること """

    def test_user_setting2(self):
        driver = SeleniumUtil.initialize_driver()

        SeleniumUtil.open_page(driver, "http://localhost:3000")

        try:
            TestUserSettingPage.login(driver)

            user_setting_element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        "//*[@id='__nuxt']/div[2]/main/div[2]/section/div[3]/div/div/p[5]",
                    )
                )
            )

            user_setting_element.click()

            WebDriverWait(driver, 10).until(EC.title_contains("ユーザ設定"))

            SeleniumUtil.take_screenshot(
                driver, "user_setting", "項番2", "ユーザ設定画面"
            )

            back_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".header-right button"))
            )

            back_button.click()

            WebDriverWait(driver, 10).until(EC.title_contains("ホーム"))

            SeleniumUtil.take_screenshot(
                driver, "user_setting", "項番2", "戻るボタン押下後"
            )

        except Exception as e:
            print(f"項番2. 戻るボタンでホーム画面に遷移すること : {e}")

        finally:
            SeleniumUtil.close_driver(driver)

    """ ログイン処理 """

    def login(driver):
        driver.find_element(By.ID, "email").send_keys(SUPERUSER_EMAIL)

        driver.find_element(By.ID, "password").send_keys(SUPERUSER_PASSWORD)

        driver.find_element(By.XPATH, "//button[@type='submit']").click()

        WebDriverWait(driver, 10).until(EC.title_contains("ホーム"))

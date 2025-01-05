from src.utils.selenium_util import SeleniumUtil
from src.utils.constants import SUPERUSER_EMAIL, SUPERUSER_PASSWORD
from selenium.webdriver.common.by import By  # type: ignore
from selenium.webdriver.support.ui import WebDriverWait  # type: ignore
from selenium.webdriver.support import expected_conditions as EC  # type: ignore

""" python -m pytest src/user_admin/test.py """

class TestUserAdminPage:
    """項番1. ユーザ管理画面が表示されること"""

    def test_user_admin1(self):
        driver = SeleniumUtil.initialize_driver()

        SeleniumUtil.open_page(driver, "http://localhost:3000")

        try:
            TestUserAdminPage.login(driver)

            user_admin_element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//*[@id='__nuxt']/div[2]/main/div[2]/section/div[3]/div/div/p[6]")
                )
            )

            user_admin_element.click()

            WebDriverWait(driver, 10).until(EC.title_contains("ユーザ管理"))

            SeleniumUtil.take_screenshot(driver, "user_admin", "項番1", "ユーザ管理画面")
            
        except Exception as e:
            print(f"項番1. ユーザ管理画面が表示されること : {e}")

        finally:
            SeleniumUtil.close_driver(driver)

    """ 項番2. 戻るボタンでホーム画面に遷移すること """

    def test_user_admin2(self):
        driver = SeleniumUtil.initialize_driver()

        SeleniumUtil.open_page(driver, "http://localhost:3000")

        try:
            TestUserAdminPage.login(driver)

            user_admin_element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//*[@id='__nuxt']/div[2]/main/div[2]/section/div[3]/div/div/p[6]")
                )
            )

            user_admin_element.click()

            WebDriverWait(driver, 10).until(EC.title_contains("ユーザ管理"))

            SeleniumUtil.take_screenshot(driver, "user_admin", "項番2", "ユーザ管理画面")

            back_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".header-right button"))
            )

            back_button.click()

            WebDriverWait(driver, 10).until(EC.title_contains("ホーム"))

            SeleniumUtil.take_screenshot(driver, "user_admin", "項番2", "戻るボタン押下後")

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

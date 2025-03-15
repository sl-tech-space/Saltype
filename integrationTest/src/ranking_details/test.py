from src.utils.selenium_util import SeleniumUtil
from src.utils.constants import SUPERUSER_EMAIL, SUPERUSER_PASSWORD
from selenium.webdriver.common.by import By  # type: ignore
from selenium.webdriver.support.ui import WebDriverWait  # type: ignore
from selenium.webdriver.support import expected_conditions as EC  # type: ignore
import time

""" python -m pytest src/ranking_details/test.py """


class TestRankingDetailsPage:
    """項番1. ランキング詳細画面が表示されること"""

    def test_ranking_details1(self):
        driver = SeleniumUtil.initialize_driver()

        SeleniumUtil.open_page(driver, "http://localhost:3000")

        try:
            TestRankingDetailsPage.login(driver)

            ranking_element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        "//*[@id='__nuxt']/div[2]/main/div[2]/section/div[3]/div/div/p[1]",
                    )
                )
            )

            ranking_element.click()

            WebDriverWait(driver, 10).until(EC.title_contains("ランキング"))

            SeleniumUtil.take_screenshot(
                driver, "ranking_details", "項番1", "ランキング画面"
            )

            driver.execute_script("window.scrollBy(0, window.innerHeight);")

            more_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (
                        By.XPATH,
                        "//*[@id='__nuxt']/div[5]/main/div/section[1]/div[5]/div/button",
                    )
                )
            )

            more_button.click()

            SeleniumUtil.take_screenshot(
                driver, "ranking_details", "項番1", "ランキング詳細画面"
            )

        except Exception as e:
            print(f"項番1. ランキング画面が表示されること : {e}")

        finally:
            SeleniumUtil.close_driver(driver)

    """ 項番2. 戻るボタンでランキング画面に遷移すること """

    def test_ranking_details2(self):
        driver = SeleniumUtil.initialize_driver()

        SeleniumUtil.open_page(driver, "http://localhost:3000")

        try:
            TestRankingDetailsPage.login(driver)

            ranking_element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        "//*[@id='__nuxt']/div[2]/main/div[2]/section/div[3]/div/div/p[1]",
                    )
                )
            )

            ranking_element.click()

            WebDriverWait(driver, 10).until(EC.title_contains("ランキング"))

            SeleniumUtil.take_screenshot(
                driver, "ranking_details", "項番2", "ランキング画面"
            )

            driver.execute_script("window.scrollBy(0, window.innerHeight);")

            more_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (
                        By.XPATH,
                        "//*[@id='__nuxt']/div[5]/main/div/section[1]/div[5]/div/button",
                    )
                )
            )

            more_button.click()

            SeleniumUtil.take_screenshot(
                driver, "ranking_details", "項番2", "ランキング詳細画面"
            )

            back_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".header-right button"))
            )

            back_button.click()

            WebDriverWait(driver, 10).until(EC.title_contains("ランキング"))

            SeleniumUtil.take_screenshot(
                driver, "ranking_details", "項番2", "戻るボタン押下後"
            )

        except Exception as e:
            print(f"項番2. 戻るボタンでランキング画面に遷移すること : {e}")

        finally:
            SeleniumUtil.close_driver(driver)

    """ ログイン処理 """

    def login(driver):
        driver.find_element(By.ID, "email").send_keys(SUPERUSER_EMAIL)

        driver.find_element(By.ID, "password").send_keys(SUPERUSER_PASSWORD)

        driver.find_element(By.XPATH, "//button[@type='submit']").click()

        WebDriverWait(driver, 10).until(EC.title_contains("ホーム"))

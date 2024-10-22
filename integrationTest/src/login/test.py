from src.utils.selenium_util import SeleniumUtil
from src.utils.constants import SUPERUSER_EMAIL, SUPERUSER_PASSWORD
from selenium.webdriver.common.by import By # type: ignore
from selenium.webdriver.support.ui import WebDriverWait # type: ignore
from selenium.webdriver.support import expected_conditions as EC # type: ignore
from selenium.common.exceptions import TimeoutException # type: ignore

""" python -m pytest src/login/test.py """
class TestLoginPage:
    
    """ 項番1. ログイン画面が表示されること """
    def test_login1(self):
        driver = SeleniumUtil.initialize_driver()
        
        try:
            SeleniumUtil.open_page(driver, 'http://localhost:3000')
            
            SeleniumUtil.take_screenshot(driver, "login", "項番1", "ログイン画面")
            
        except Exception as e:
            print(f"項番1. ログイン画面が表示されること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
    
    """ 項番2. ログインができること """
    def test_login2(self):
        driver = SeleniumUtil.initialize_driver()
        
        try:
            SeleniumUtil.open_page(driver, 'http://localhost:3000')
            
            SeleniumUtil.take_screenshot(driver, "login", "項番2", "ログイン画面")
            
            driver.find_element(By.ID, "email").send_keys(SUPERUSER_EMAIL)
            
            driver.find_element(By.ID, "password").send_keys(SUPERUSER_PASSWORD)
            
            SeleniumUtil.take_screenshot(driver, "login", "項番2", "ログイン前")
        
            driver.find_element(By.XPATH, "//button[@type='submit']").click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("ホーム"))
            
            SeleniumUtil.take_screenshot(driver, "login", "項番2", "ログイン後")
            
        except Exception as e:
            print(f"項番2. ログインができること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
        """ 項番3. 異常値の場合、ログインできないこと """
    def test_login3(self):
        driver = SeleniumUtil.initialize_driver()
        
        try:
            SeleniumUtil.open_page(driver, 'http://localhost:3000')
            
            SeleniumUtil.take_screenshot(driver, "login", "項番3", "ログイン画面")
            
            driver.find_element(By.ID, "email").send_keys("dummyemail@example.com")
            
            driver.find_element(By.ID, "password").send_keys("dummypassword")
            
            SeleniumUtil.take_screenshot(driver, "login", "項番3", "ログイン前")
        
            driver.find_element(By.XPATH, "//button[@type='submit']").click()
            
            try:
                WebDriverWait(driver, 10).until(
                    EC.title_contains("ホーム")
                )
            except TimeoutException:
                pass
            
            SeleniumUtil.take_screenshot(driver, "login", "項番3", "ログイン後")
            
        except Exception as e:
            print(f"項番3. 異常値の場合、ログインできないこと : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
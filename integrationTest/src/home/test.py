from src.utils.selenium_util import SeleniumUtil
from src.utils.constants import SUPERUSER_EMAIL, SUPERUSER_PASSWORD
import time
from selenium.webdriver.common.by import By # type: ignore
from selenium.webdriver.support.ui import WebDriverWait # type: ignore
from selenium.webdriver.support import expected_conditions as EC # type: ignore

""" python -m pytest src/home/test.py """
class TestHomePage:
    
    """ 項番1. ホーム画面が表示されること """
    def test_home1(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番1", "ホーム画面")
        
        except Exception as e:
            print(f"項番1. ホーム画面が表示されること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    """ 項番2. 日本語、イージーモードでタイピング画面に遷移すること """
    def test_home2(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番2", "ホーム画面")
            
            start_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".start-button"))
            )
            
            SeleniumUtil.take_screenshot(driver, "home", "項番2", "ホーム画面スタートボタン押下前")
    
            start_button.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("タイピング"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番2", "タイピング画面")
        
        except Exception as e:
            print(f"項番2. 日本語、イージーモードでタイピング画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    """ 項番3. 日本語、ノーマルモードでタイピング画面に遷移すること """
    def test_home3(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番3", "ホーム画面")
            
            next_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".difficulty-setting .embla__next"))
            )
            
            next_button.click()
            
            time.sleep(1)
            
            start_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".start-button"))
            )
            
            SeleniumUtil.take_screenshot(driver, "home", "項番3", "ホーム画面スタートボタン押下前")
    
            start_button.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("タイピング"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番3", "タイピング画面")
        
        except Exception as e:
            print(f"項番3. 日本語、ノーマルモードでタイピング画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    """ 項番4. 日本語、ハードモードでタイピング画面に遷移すること """
    def test_home4(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番4", "ホーム画面")
            
            next_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".difficulty-setting .embla__next"))
            )
            
            next_button.click()
            
            time.sleep(1)
            
            next_button.click()
            
            time.sleep(1)
            
            start_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".start-button"))
            )
            
            SeleniumUtil.take_screenshot(driver, "home", "項番4", "ホーム画面スタートボタン押下前")
    
            start_button.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("タイピング"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番4", "タイピング画面")
        
        except Exception as e:
            print(f"項番4. 日本語、ハードモードでタイピング画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    """ 項番5. 英語、イージーモードでタイピング画面に遷移すること """
    def test_home5(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番5", "ホーム画面")
            
            next_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".language-setting .embla__next"))
            )
            
            next_button.click()
            
            time.sleep(1)
            
            start_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".start-button"))
            )
            
            SeleniumUtil.take_screenshot(driver, "home", "項番5", "ホーム画面スタートボタン押下前")
    
            start_button.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("タイピング"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番5", "タイピング画面")
        
        except Exception as e:
            print(f"項番5. 英語、イージーモードでタイピング画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
    
    """ 項番6. 英語、ノーマルモードでタイピング画面に遷移すること """
    def test_home6(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番6", "ホーム画面")
            
            next_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".language-setting .embla__next"))
            )
            
            next_button.click()
            
            time.sleep(1)
            
            next_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".difficulty-setting .embla__next"))
            )
            
            next_button.click()
            
            time.sleep(1)
            
            start_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".start-button"))
            )
            
            SeleniumUtil.take_screenshot(driver, "home", "項番6", "ホーム画面スタートボタン押下前")
    
            start_button.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("タイピング"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番6", "タイピング画面")
        
        except Exception as e:
            print(f"項番6. 英語、ノーマルモードでタイピング画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    """ 項番7. 英語、ハードモードでタイピング画面に遷移すること """
    def test_home7(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番7", "ホーム画面")
            
            next_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".language-setting .embla__next"))
            )
            
            next_button.click()
            
            time.sleep(1)
            
            next_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".difficulty-setting .embla__next"))
            )
            
            next_button.click()
            
            time.sleep(1)
            
            next_button.click()
            
            time.sleep(1)
            
            start_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".start-button"))
            )
            
            SeleniumUtil.take_screenshot(driver, "home", "項番7", "ホーム画面スタートボタン押下前")
    
            start_button.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("タイピング"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番7", "タイピング画面")
        
        except Exception as e:
            print(f"項番7. 英語、ハードモードでタイピング画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    """ 項番8. ランキング画面に遷移すること """
    def test_home8(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番8", "ホーム画面")
            
            ranking_element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//ul[@class='menu-list']/li[1]/p"))
            )
            
            ranking_element.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("ランキング"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番8", "ランキング画面")
        
        except Exception as e:
            print(f"項番8. ランキング画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    """ 項番9. 分析情報画面に遷移すること """
    def test_home9(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番9", "ホーム画面")
            
            ranking_element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//ul[@class='menu-list']/li[2]/p"))
            )
            
            ranking_element.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("分析情報"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番9", "分析情報画面")
        
        except Exception as e:
            print(f"項番9. 分析情報画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    """ 項番10. ご要望画面に遷移すること """
    def test_home10(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番10", "ホーム画面")
            
            ranking_element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//ul[@class='menu-list']/li[3]/p"))
            )
            
            ranking_element.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("ご要望"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番10", "ご要望画面")
        
        except Exception as e:
            print(f"項番10. ご要望画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    """ 項番11. ログアウトでログイン画面に遷移すること """
    def test_home11(self):
        driver = SeleniumUtil.initialize_driver()
        
        SeleniumUtil.open_page(driver, 'http://localhost:3000')
        
        try:
            TestHomePage.login(driver)
            
            SeleniumUtil.take_screenshot(driver, "home", "項番11", "ホーム画面")
            
            logout_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".menu-card button"))
            )
            
            logout_button.click()
            
            WebDriverWait(driver, 10).until(EC.title_contains("ログイン"))
            
            SeleniumUtil.take_screenshot(driver, "home", "項番11", "ログイン画面")
        
        except Exception as e:
            print(f"項番11. ログアウトでログイン画面に遷移すること : {e}")
        
        finally:
            SeleniumUtil.close_driver(driver)
            
    
    """ ログイン処理 """
    def login(driver):
        driver.find_element(By.ID, "email").send_keys(SUPERUSER_EMAIL)
            
        driver.find_element(By.ID, "password").send_keys(SUPERUSER_PASSWORD)
        
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
            
        WebDriverWait(driver, 10).until(EC.title_contains("ホーム"))
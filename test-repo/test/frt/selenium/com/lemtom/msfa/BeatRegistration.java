package com.lemtom.msfa;

import java.io.FileInputStream;
import java.util.List;
import java.util.Properties;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;

public class BeatRegistration {

	private static Properties defaultProps = null;
	private static FileInputStream in = null;
	
	
	
	private static WebDriver driver;
	
	@BeforeClass
	public static void setup() throws Exception{
		
		System.setProperty("webdriver.chrome.driver","D://chromedriver.exe");
		driver= new ChromeDriver();
		driver.manage().window().maximize();
		driver.get("http://220.227.255.237/msfa/login.jsp");		
	}
	@Test
	public void test_login(){
		
		try {
			in = new FileInputStream("Resources/msfa.properties");
		    defaultProps = new Properties();
		    defaultProps.load(in);
		} catch (Exception e) {
			e.printStackTrace();			
		}			
		driver.findElement(By.id("userId")).sendKeys(defaultProps.getProperty("username"));
		driver.findElement(By.id("passwordId")).sendKeys(defaultProps.getProperty("password"));
		//driver.findElement(By.xpath("//input[@class='login-btn']")).click();
		driver.switchTo().activeElement().sendKeys(Keys.ENTER);
		waitSeconds(5);
	}
	
	@Test
	public void beatReg_test(){	
		Integer num= (int)(Math.random()*10000);
		String beatName = "BEAT"+num.toString(); 
		
		WebElement register = driver.findElement(By.xpath("//ul[@id='nav']/li[1]/a"));
		WebElement  beat= driver.findElement(By.xpath("//ul[@id='nav']/li[1]/ul[1]/li[1]/a"));
		Actions builder = new Actions(driver); 
		builder.moveToElement(register); 
		builder.moveToElement(beat);
		waitSeconds(3);
		builder.click(beat);
		builder.build().perform(); 
		waitSeconds(10);
		driver.findElement(By.id("beatname")).sendKeys(beatName);		
		Select wardNameSelect = new Select(driver.findElement(By.id("wardname")));
		wardNameSelect.selectByVisibleText("HAFEEZPET");
		Select userNameSelect = new Select(driver.findElement(By.id("username")));
		userNameSelect.selectByVisibleText("Suresh A");
		driver.findElement(By.id("beatFormId_button_beat_register_beat")).click();
		waitSeconds(10);
		List<WebElement> tableRows = driver.findElements(By.xpath("//table[@id='alternatecolor']//tbody//tr"));
		System.out.println( "list size is : "+tableRows.size());
		boolean found = false;
		int i;
		for( i=1;i<=tableRows.size();i++){
			String name = driver.findElement(By.xpath("//table[@id='alternatecolor']//tbody//tr["+i+"]//td[2]")).getText();
			if(name.equals(beatName)){
				found=true;
				break;
			}
		}
		Assert.assertTrue(found);
	}
	
	@AfterClass
	public static void close(){
		driver.quit();
	}
	public static void waitSeconds(long sec){		
		long end = System.currentTimeMillis()+ sec*1000;		
		while (System.currentTimeMillis() < end) {		
		}	
	}
}

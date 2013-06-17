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

public class OutletRegistration {

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
	public void outletReg_test(){
		Integer num= (int)(Math.random()*10000);
		String outletName = "OUTLET"+num.toString(); 
		
		WebElement register = driver.findElement(By.xpath("//ul[@id='nav']/li[1]/a"));
		WebElement  beat= driver.findElement(By.xpath("//ul[@id='nav']/li[1]/ul[1]/li[2]/a"));
		Actions builder = new Actions(driver); 
		builder.moveToElement(register); 
		builder.moveToElement(beat);
		waitSeconds(3);
		builder.click(beat);
		builder.build().perform(); 
		waitSeconds(10);

		driver.findElement(By.id("outletname")).sendKeys(outletName);
		driver.findElement(By.id("retailerName")).sendKeys("demo");
		driver.findElement(By.id("lapu1")).sendKeys("9887332445");
		// duplicate
		driver.findElement(By.id("lapu2")).sendKeys("9885445895");		
		Select outletCategorySelect = new Select(driver.findElement(By.id("category")));
		outletCategorySelect.selectByVisibleText("A+");		
		Select outletChannelSelect = new Select(driver.findElement(By.id("channelid")));
		outletChannelSelect.selectByVisibleText("Mobile Shop");			
		Select outletBeatSelect = new Select(driver.findElement(By.id("beatid")));
		outletBeatSelect.selectByVisibleText("KOTHAGUDA");	
		waitSeconds(5);
				
		driver.findElement(By.id("outlet.outletTypesList-2")).click();
				
		Select outletServiceTypeSelect = new Select(driver.findElement(By.id("servicetypeid")));
		outletServiceTypeSelect.selectByVisibleText("Weekly Twice");			
		driver.findElement(By.id("address")).sendKeys("Madhapur");
		driver.findElement(By.id("landmark")).sendKeys("DLF");
		driver.findElement(By.id("city")).sendKeys("Hyderabad");
		driver.findElement(By.id("postalcode")).sendKeys("500073");		
		Select outletStateSelect = new Select(driver.findElement(By.id("state")));
		outletStateSelect.selectByVisibleText("Andhra Pradesh");			
		driver.findElement(By.id("phone")).sendKeys("9885746363");		
		driver.findElement(By.id("bdate")).sendKeys("08/05/1979");
		driver.findElement(By.id("adate")).sendKeys("08/05/2010");		
		driver.findElement(By.id("outletRegistration_button_outlet_register_outlet")).click();
		
		List<WebElement> tableRows = driver.findElements(By.xpath("//table[@id='yourTableID2']//tbody//tr"));
		System.out.println( "list size is : "+tableRows.size());
		
		boolean found = false;
		int i;
		for( i=1;i<=tableRows.size();i++){
			String skucode = driver.findElement(By.xpath("//table[@id='yourTableID2']//tbody//tr["+i+"]//td[1]")).getText();
			if(skucode.equals(outletName)){
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

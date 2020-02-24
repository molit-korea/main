package kr.ac.skuniv.realestate.utill;

import kr.ac.skuniv.realestate.domain.entity.RegionCode;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

@Component
@Slf4j
public class ExcelConverterUtill {
    private final String EXCEL_PATH_FOR_WINDOW = "C:\\Users\\Kimyunsang\\Desktop\\spring\\RegionCode.xlsx";
    private final String EXCEL_PATH_FOR_LINUX = "/home/ec2-user/realestate/RegionCode.xlsx";
    HashMap<String, String> regionCodeMap;

    public HashMap<String, String> getRegionCodeMap() {
        return regionCodeMap;
    }

    public void ReadRegionCode() throws FileNotFoundException, IOException {
        regionCodeMap = new HashMap<>();
        XSSFWorkbook workbook;
        XSSFSheet sheet;
        XSSFRow row;
        XSSFCell cell;
        FileInputStream fis;
        //FileInputStream fis = new FileInputStream(EXCEL_PATH_FOR_WINDOW);
        try {
            fis = new FileInputStream(EXCEL_PATH_FOR_LINUX);
        } catch (Exception e){
            fis = new FileInputStream(EXCEL_PATH_FOR_WINDOW);
        }
        workbook = new XSSFWorkbook(fis);
        int rowIndex = 0;
        int columnIndex = 0;
        String tmpRegion = null;
        RegionCode regionCode1, regionCode2;
        Set<String> mySet = new HashSet<>();
        sheet = workbook.getSheetAt(0);
        for (Row row1 : sheet) {
            String regionName = row1.getCell(0).toString();
            String regionCode = String.valueOf(new BigDecimal(row1.getCell(1).toString()).toBigInteger());
            mySet.add(regionCode);
            if (regionCodeMap.get(regionName) != null) {
                log.warn(String.format("miss data => %s", regionName));
            }
            regionCodeMap.put(regionName, regionCode);
        }
        System.out.println("===================" + mySet.size());

//        int rows = sheet.getPhysicalNumberOfRows();
//        for(rowIndex = 0; rowIndex< rows; rowIndex++){
//            row = sheet.getRow(rowIndex);
//            if(row != null){
//                int cells = row.getPhysicalNumberOfCells();
//                for(columnIndex=0; columnIndex< cells; columnIndex++){
//                    cell=row.getCell(columnIndex);
//                    String value = "";
//                    if(cell == null)
//                        continue;
//                    else{
//                        if(columnIndex == 0) {
//                            tmpRegion = cell.getStringCellValue()+"";
//                        }
//                        else if(columnIndex == 1 && tmpRegion != null){
//                            regionCodeMap.put(tmpRegion, String.valueOf((int)cell.getNumericCellValue()));
//                        }
//                    }
//                }
//            }
    }
}


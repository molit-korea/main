package kr.ac.skuniv.realestate.service;


import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphTmpDto;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Log4j2
public class GraphServiceUtil {

    private static final List<String> HOUSING_TYPE = Arrays.asList("apart", "officetel", "house");

    /* 빈 그래프 디티오 가져오기 */
    public List<GraphDto> emptyGraphDtoList(String dealType){
        List<GraphDto> emptyGraphDtoList = new ArrayList<>();

        for (String housingType : HOUSING_TYPE) {
            emptyGraphDtoList.add(GraphDto.builder().dealType(dealType).housingType(housingType).average(null).build());
        }

        return emptyGraphDtoList;
    }

    /* 평균값 맵 초기화 */
    public Map<String, Double> initAverageMap(int first, int end) {
        Map<String, Double> averageMap = new HashMap<>();
        log.warn("initAverageMap");
        while(first <= end){
            averageMap.put(String.valueOf(first), new Double(0));
            first++;
        }

        return averageMap;
    }

    /* 날짜 가져오기 */
    public int getDate(GraphTmpDto graphTmpDto, int type) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(graphTmpDto.getDate());

        return calendar.get(type);
    }

    /* 평균 리스트 초기화 */
    public List<Double> initAverageList(int size) {
        List<Double> averageList = new ArrayList<>();

        for ( int i = 0 ; i <= size ; i++){
            averageList.add(null);
        }

        return averageList;
    }

    /* 전체 평균의 평균값 반환 */
    public Double getMapAverage(Map<String, Double> averageMap) {
        log.warn("getMapAverage");
        Set<String> keySet = averageMap.keySet();
        Double total = 0.0;
        int count = 0;
        for (String key : keySet){
            Double aDouble = averageMap.get(key);
            total += aDouble;
            if(aDouble != 0.0){
                count++;
            }
        }
        return total / count;
    }

    /* 데이터가 없으면 평균값으로 채우기*/
    public Map<String, Double> setNullValue(Map<String, Double> averageMap, Double averageValue) {
        Set<String> keySet = averageMap.keySet();
        List<String> keyList = new ArrayList<>();

        keyList.addAll(keySet);

        for (String key : keyList){
            if(averageMap.get(key).equals(new Double(0.0))){
                averageMap.remove(key);
                averageMap.put(key, Math.round(averageValue * 10) / 10.0);
            }
        }

        log.warn(averageMap.toString());
        return averageMap;
    }

}

package kr.ac.skuniv.realestate.service;

import kr.ac.skuniv.realestate.domain.dto.DateDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphTmpDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.RegionDto;
import kr.ac.skuniv.realestate.repository.BargainDateRepository;
import kr.ac.skuniv.realestate.repository.CharterDateRepository;
import kr.ac.skuniv.realestate.repository.RentDateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
//@RequiredArgsConstructor
public class GraphService {
    private Logger logger = LoggerFactory.getLogger(GraphService.class);
    private final BargainDateRepository bargainDateRepository;
    private final CharterDateRepository charterDateRepository;
    private final RentDateRepository rentDateRepository;
    private static final List<String> HOUSING_TYPE = Arrays.asList("apart", "officetel", "house");
    @Autowired
    private GraphServiceUtil graphServiceUtil;

    public GraphService(BargainDateRepository bargainDateRepository, CharterDateRepository charterDateRepository, RentDateRepository rentDateRepository) {
        this.bargainDateRepository = bargainDateRepository;
        this.charterDateRepository = charterDateRepository;
        this.rentDateRepository = rentDateRepository;
    }

    /*  그래프 디티오 조회 */
    public List<GraphDto> getGraphDtos(RegionDto regionDto, DateDto dateDto) {
        logger.warn("getGraphDtos");
        Map<String, List<GraphTmpDto>> graphTmpDtoMap = getGraphTmpDtoMap(regionDto, dateDto); // 디비 조회 후 맵 형식 변환

        logger.warn(graphTmpDtoMap.values().toString());

        graphTmpDtoMap = setDealTypeOnGraphTmpDtoList(graphTmpDtoMap);  // 그래프 템프 디티오에 딜타입 지정

        List<GraphDto> graphDtoList = mergeGraphTmpDtoListToGraphDtoList(graphTmpDtoMap, dateDto);  // 실제 반환 할 디티오로 변환

        return graphDtoList;
    }

    /* 날짜를 날짜 디티오로 변경 */
    public DateDto convertDateToDto(String date) {
        logger.warn("convertDateToDto");
        String[] splitDate = date.split("-");
        DateDto dateDto = null;

        if (splitDate.length == 1) {
            dateDto = new DateDto(LocalDate.of(Integer.parseInt(splitDate[0]), 1, 1), DateDto.DateType.MONTH);
        } else if (splitDate.length == 2) {
            dateDto = new DateDto(LocalDate.of(Integer.parseInt(splitDate[0]), Integer.parseInt(splitDate[1]), 1), DateDto.DateType.DAY);
        }
        return dateDto;
    }

    /* 디비 조회 후 그래프 템프 디티오 맵 가져오기 */
    private Map<String, List<GraphTmpDto>> getGraphTmpDtoMap(RegionDto regionDto, DateDto dateDto) {
        logger.warn("getGraphTmpDtoMap");
        Map<String, List<GraphTmpDto>> graphTmpDtoMap = new HashMap<>();

        List<GraphTmpDto> charterDateGraphTmpDtos = charterDateRepository.getByRegionDtoAndDateDto(regionDto, dateDto);
        List<GraphTmpDto> bargainDateGraphTmpDtos = bargainDateRepository.getByRegionDtoAndDateDto(regionDto, dateDto);
        List<GraphTmpDto> rentDateGraphTmpDtos = rentDateRepository.getByRegionDtoAndDateDto(regionDto, dateDto);

        logger.warn("charter data size = " + charterDateGraphTmpDtos.size());
        logger.warn("rent data size = " + rentDateGraphTmpDtos.size());

        graphTmpDtoMap.put("bargain", bargainDateGraphTmpDtos);
        graphTmpDtoMap.put("charter", charterDateGraphTmpDtos);
        graphTmpDtoMap.put("rent", rentDateGraphTmpDtos);

        return graphTmpDtoMap;
    }

    /* 그래프 템프 디티오 맵에 거래 타입 지정 */
    private Map<String, List<GraphTmpDto>> setDealTypeOnGraphTmpDtoList(Map<String, List<GraphTmpDto>> graphTmpDtoListMap) {
        logger.warn("setDealTypeOnGraphTmpDtoList");
        Set<String> keySet = graphTmpDtoListMap.keySet();

        keySet.forEach(key -> {
            graphTmpDtoListMap.put(key, setDealType(graphTmpDtoListMap.get(key), key)); // 거래 타입 지정 후 저장
        });

        return graphTmpDtoListMap; // 거래 타입 지정 된 맵 반환
    }

    /* 그래프 템프 디티오에 거래 타입 지정 */
    private List<GraphTmpDto> setDealType(List<GraphTmpDto> graphTmpDtoList, String key) {
        logger.warn("setDealType");
        String dealType = key;

        for (GraphTmpDto graphTmpDto : graphTmpDtoList) {
            graphTmpDto.setDealType(dealType);  // 그래프 템프 디티오에 거래 타입 지정
        }
        return graphTmpDtoList;
    }

    /* 그래프 템프 디티오를 그래프 디티오로 변경 후 하나의 리스트로 합침 */
    private List<GraphDto> mergeGraphTmpDtoListToGraphDtoList(Map<String, List<GraphTmpDto>> graphTmpDtoMap, DateDto dateDto) {
        logger.warn("mergeGraphTmpDtoListToGraphDtoList");
        List<GraphDto> graphDtoList = new ArrayList<>();

        Set<String> keySet = graphTmpDtoMap.keySet();

        for (String s : keySet) {
            graphDtoList.addAll(convertGraphTmpDtoListToGraphDtoList(graphTmpDtoMap.get(s), s, dateDto)); // 그래프 템프 -> 그래프 디티오로 변환 후 저장
        }

        return graphDtoList;
    }

    /* 그래프 템프 디티오를 그래프 디티오로 변경 */
    public List<GraphDto> convertGraphTmpDtoListToGraphDtoList(List<GraphTmpDto> graphTmpDtoList, String deal, DateDto dateDto) {
        logger.warn("convertGraphTmpDtoListToGraphDtoList");
        if(graphTmpDtoList.size() <= 0){
            return graphServiceUtil.emptyGraphDtoList(deal);
        }

        Map<String, List<GraphTmpDto>> separateHousingTypeMap = separateHousingType(graphTmpDtoList); // 하우징 타입 별로 구분

        Set<String> keySet = separateHousingTypeMap.keySet();

        List<GraphDto> graphDtoList = new ArrayList<>();

        for (String s : keySet) {
            graphDtoList.add(addGraphDto(separateHousingTypeMap.get(s), deal, s, dateDto)); // 하우징 타입 별로 구분 후 날짜 형식에 따라 디티오 변환 후 추가
        }

        return graphDtoList;
    }

    /* 하우징 타입 별로 구분 후 맵 으로 반환 */
    public Map<String, List<GraphTmpDto>> separateHousingType(List<GraphTmpDto> graphTmpDtoList){
        logger.warn("separateHousingType");
        Map<String, List<GraphTmpDto>> separateHousingTypeMap = new HashMap<>();

        for (String housingType : HOUSING_TYPE) {
            separateHousingTypeMap.put(housingType, new ArrayList<>());
        }

        for (GraphTmpDto graphTmpDto : graphTmpDtoList) {
            List<GraphTmpDto> arr = separateHousingTypeMap.get(graphTmpDto.getHousingType());
            arr.add(graphTmpDto);
            separateHousingTypeMap.put(graphTmpDto.getHousingType(), arr);
        }
        return separateHousingTypeMap;
    }

    /* 연도 별 일 경우에 평균 값 리스트 반환 */
    public GraphDto setAverageListYear(List<GraphTmpDto> graphTmpDtoList) {
        logger.warn("setAverageListYear");
        int firstYear = graphServiceUtil.getDate(graphTmpDtoList.get(0), Calendar.YEAR);
        int prevYear = firstYear;
        int year = Calendar.getInstance().get(Calendar.YEAR);

        Map<String, Double> averageMap = graphServiceUtil.initAverageMap(prevYear, year);

        prevYear = firstYear;



        // 값 넣기
        for (GraphTmpDto graphTmpDto : graphTmpDtoList) {
            int currentYear = graphServiceUtil.getDate(graphTmpDto, Calendar.YEAR);
            if(currentYear == prevYear) {
                averageMap.remove(String.valueOf(currentYear));
                averageMap.put(String.valueOf(currentYear), Math.round(graphTmpDto.getAverage() * 10) / 10.0);
            }
            prevYear++;
        }

        double averageValue = graphServiceUtil.getMapAverage(averageMap);
        averageMap = graphServiceUtil.setNullValue(averageMap, averageValue);

        return GraphDto.builder().housingType(graphTmpDtoList.get(0).getHousingType()).dealType(graphTmpDtoList.get(0).getDealType()).
                average(averageMap).build();
    }

    /* 월 별 일 경우에 평균 값 리스트 반환 */
    public GraphDto setAverageListMonth(List<GraphTmpDto> graphTmpDtoList) {
        Map<String, Double> averageMap = graphServiceUtil.initAverageMap(1, 12);

        // 값 넣기
        for (GraphTmpDto graphTmpDto : graphTmpDtoList) {
            int currentMonth = graphServiceUtil.getDate(graphTmpDto, Calendar.MONTH);
            averageMap.remove(String.valueOf(currentMonth + 1));
            averageMap.put(String.valueOf(currentMonth + 1), Math.round(graphTmpDto.getAverage() * 10) / 10.0);
        }

        double averageValue = graphServiceUtil.getMapAverage(averageMap);
        averageMap = graphServiceUtil.setNullValue(averageMap, averageValue);

        return GraphDto.builder().housingType(graphTmpDtoList.get(0).getHousingType()).dealType(graphTmpDtoList.get(0).getDealType()).
                average(averageMap).build();
    }

    /* 일 별 일 경우에 평균 값 리스트 반환 */
    public GraphDto setAverageListDay(List<GraphTmpDto> graphTmpDtoList) {
        Map<String, Double> averageMap = graphServiceUtil.initAverageMap(1, 31);

        // 값 넣기
        for (GraphTmpDto graphTmpDto : graphTmpDtoList) {
            int currentDay = graphServiceUtil.getDate(graphTmpDto, Calendar.DATE);
            averageMap.remove(String.valueOf(currentDay));
            averageMap.put(String.valueOf(currentDay), Math.round(graphTmpDto.getAverage() * 10) / 10.0);
        }

        double averageValue = graphServiceUtil.getMapAverage(averageMap);
        averageMap = graphServiceUtil.setNullValue(averageMap, averageValue);

        return GraphDto.builder().housingType(graphTmpDtoList.get(0).getHousingType()).dealType(graphTmpDtoList.get(0).getDealType()).
                average(averageMap).build();
    }

    /* 그래프 디티오 변환 후 반환 */
    private GraphDto addGraphDto(List<GraphTmpDto> graphTmpDtoList, String deal, String housing,DateDto dateDto) {
        GraphDto graphDto = null;
        if(graphTmpDtoList.size() <= 0 ){
            //graphDtoList.add(GraphDto.builder().dealType(deal).housingType(s).average(null).build());
            return GraphDto.builder().dealType(deal).housingType(housing).average(null).build();
        }
        switch (dateDto.getDateType()) {
            case YEAR:
                graphDto = setAverageListYear(graphTmpDtoList);
                break;
            case MONTH:
                graphDto = setAverageListMonth(graphTmpDtoList);
                break;
            case DAY:
                graphDto = setAverageListDay(graphTmpDtoList);
                break;
        }
        return graphDto;
    }
}
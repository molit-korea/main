package kr.ac.skuniv.realestate.service;

import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchReqDto;
import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchResDto;
import kr.ac.skuniv.realestate.domain.entity.BargainDate;
import kr.ac.skuniv.realestate.domain.entity.CharterDate;
import kr.ac.skuniv.realestate.domain.entity.RentDate;
import kr.ac.skuniv.realestate.repository.BuildingRepository;
import kr.ac.skuniv.realestate.repository.RegionCodeRepository;
import kr.ac.skuniv.realestate.repository.impl.BargainDateRepositoryImpl;
import kr.ac.skuniv.realestate.repository.impl.CharterDateRepositoryImpl;
import kr.ac.skuniv.realestate.repository.impl.RentDateRepositoryImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by YoungMan on 2019-02-16.
 */

@Service @Log4j2
@RequiredArgsConstructor
public class SearchService {

    private final BuildingRepository buildingRepository;
    private final BargainDateRepositoryImpl bargainDateRepository;
    private final CharterDateRepositoryImpl charterDateRepository;
    private final RentDateRepositoryImpl rentDateRepository;
    private final RegionCodeRepository regionCodeRepository;

    public List<SearchResDto> getBuildingList(SearchReqDto searchReqDto) {

        List<SearchResDto> searchResDtoList = new ArrayList<>();

        switch (searchReqDto.getDealType()){
            case "bargain":
                List<BargainDate> bargainList = getBargainList(searchReqDto);
                searchResDtoList = buildSearchResDtoByBargainDto(bargainList);
                break;
            case "charter":
                List<CharterDate> charterList = getCharterList(searchReqDto);
                searchResDtoList = buildSearchResDtoByCharterDto(charterList);
                break;
            case "rent":
                List<RentDate> rentList = getRentList(searchReqDto);
                searchResDtoList = buildSearchResDtoByRentDto(rentList);
                break;
        }
        return searchResDtoList;
    }

    private List<BargainDate> getBargainList(SearchReqDto searchReqDto) {
        List<BargainDate> buildingByAddressAndHousingType = bargainDateRepository.getBuildingByAddressAndHousingType(searchReqDto);

        return buildingByAddressAndHousingType;
    }

    private List<CharterDate> getCharterList(SearchReqDto searchReqDto) {
        List<CharterDate> buildingByAddressAndHousingType = charterDateRepository.getBuildingByAddressAndHousingType(searchReqDto);

        return buildingByAddressAndHousingType;
    }

    private List<RentDate> getRentList(SearchReqDto searchReqDto) {
        List<RentDate> buildingByAddressAndHousingType = rentDateRepository.getBuildingByAddressAndHousingType(searchReqDto);

        return buildingByAddressAndHousingType;
    }

    private List<SearchResDto> buildSearchResDtoByBargainDto(List<BargainDate> bargainDates){
        List<SearchResDto> searchResDtos = new ArrayList<>();
        bargainDates.forEach(bargainDate -> {
            String city = String.valueOf(bargainDate.getBuilding().getCity());
            String groop = String.valueOf(bargainDate.getBuilding().getGroop());
            SearchResDto searchResDto = SearchResDto.builder()
                    .address(regionCodeRepository.findById(city + groop+ "00000").get().getValue())
                    .dong(bargainDate.getBuilding().getDong().trim())
                    .buildingNum(bargainDate.getBuilding().getBuildingNum())
                    .name(bargainDate.getBuilding().getName().trim()).area(bargainDate.getBuilding().getArea())
                    .floor(bargainDate.getBuilding().getFloor()).constructorYear(bargainDate.getBuilding().getConstructYear())
                    .price(bargainDate.getPrice()).date(bargainDate.getDate()).type(bargainDate.getBuilding().getType()).build();

            searchResDtos.add(searchResDto);
        });

        return searchResDtos;
    }

    private List<SearchResDto> buildSearchResDtoByCharterDto(List<CharterDate> charterDates){
        List<SearchResDto> searchResDtos = new ArrayList<>();
        charterDates.forEach(charterDate -> {
            String city = String.valueOf(charterDate.getBuilding().getCity());
            String groop = String.valueOf(charterDate.getBuilding().getGroop());
            SearchResDto searchResDto = SearchResDto.builder()
                    .address(regionCodeRepository.findById(city + groop + "00000").get().getValue())
                    .dong(charterDate.getBuilding().getDong().trim())
                    .buildingNum(charterDate.getBuilding().getBuildingNum())
                    .name(charterDate.getBuilding().getName().trim()).area(charterDate.getBuilding().getArea())
                    .floor(charterDate.getBuilding().getFloor()).constructorYear(charterDate.getBuilding().getConstructYear())
                    .price(charterDate.getPrice()).date(charterDate.getDate()).type(charterDate.getBuilding().getType()).build();

            searchResDtos.add(searchResDto);
        });

        return searchResDtos;
    }

    private List<SearchResDto> buildSearchResDtoByRentDto(List<RentDate> rentDates){
        List<SearchResDto> searchResDtos = new ArrayList<>();
        rentDates.forEach(rentDate -> {
            String city = String.valueOf(rentDate.getBuilding().getCity());
            String groop = String.valueOf(rentDate.getBuilding().getGroop());
            SearchResDto searchResDto = SearchResDto.builder()
                    .address(regionCodeRepository.findById(city + groop + "00000").get().getValue())
                    .dong(rentDate.getBuilding().getDong().trim())
                    .buildingNum(rentDate.getBuilding().getBuildingNum())
                    .name(rentDate.getBuilding().getName().trim()).area(rentDate.getBuilding().getArea())
                    .floor(rentDate.getBuilding().getFloor()).constructorYear(rentDate.getBuilding().getConstructYear())
                    .price(rentDate.getMonthlyPrice()).deposit(rentDate.getGuaranteePrice()).date(rentDate.getDate()).type(rentDate.getBuilding().getType()).build();

            searchResDtos.add(searchResDto);
        });

        return searchResDtos;
    }
}

package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.BusClass;
import com.k4ktyc.bustickets.domain.BusModel;
import com.k4ktyc.bustickets.domain.dto.BusModelDto;
import com.k4ktyc.bustickets.repository.BusClassRepository;
import com.k4ktyc.bustickets.repository.BusModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BusService {

    private final BusClassRepository busClassRepository;
    private final BusModelRepository busModelRepository;

    @Autowired
    public BusService(BusClassRepository busClassRepository, BusModelRepository busModelRepository) {
        this.busClassRepository = busClassRepository;
        this.busModelRepository = busModelRepository;
    }


    public Iterable<BusClass> getBusClasses() {
        return busClassRepository.findAll();
    }

    public BusModelDto save(BusModelDto busModelDto) {
        BusModel bm = createModelFromDto(busModelDto);
        return createDtoFromModel(busModelRepository.save(bm));
    }

    public Page<BusModelDto> getBusModels(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 20, Sort.by("name"));
        Page<BusModel> pagedModels = busModelRepository.findAll(paging);

        return pagedModels.map(this::createDtoFromModel);
    }

    public Page<BusModelDto> getBusModels(int pageNumber, String filter) {
        PageRequest paging = PageRequest.of(pageNumber, 20, Sort.by("name"));
        Page<BusModel> pagedModels = busModelRepository.findByNameContaining(filter, paging);

        return pagedModels.map(this::createDtoFromModel);
    }

    public Page<BusModelDto> getBusModels(boolean isUnpaged) {
        Page<BusModel> unpagedModels = busModelRepository.findAll(Pageable.unpaged());

        return unpagedModels.map(this::createDtoFromModel);
    }

    public void deleteById(long id) {
        busModelRepository.deleteById(id);
    }


    private BusModelDto createDtoFromModel(BusModel bm) {
        BusModelDto dto = new BusModelDto();
        dto.setId(bm.getId());
        dto.setName(bm.getName());
        dto.setNumberOfSeats(bm.getNumberOfSeats());
        dto.setBusClassName(bm.getBusClass().getName());

        return dto;
    }

    private BusModel createModelFromDto(BusModelDto dto) {
        BusModel bm = new BusModel();
        bm.setName(dto.getName());
        bm.setNumberOfSeats(dto.getNumberOfSeats());
        //TODO handle exception
        BusClass busClass = busClassRepository.findById(dto.getBusClassId()).get();
        bm.setBusClass(busClass);

        return bm;
    }
}

package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.Bus;
import com.k4ktyc.bustickets.domain.BusClass;
import com.k4ktyc.bustickets.domain.BusModel;
import com.k4ktyc.bustickets.domain.dto.BusDto;
import com.k4ktyc.bustickets.domain.dto.BusModelDto;
import com.k4ktyc.bustickets.repository.BusClassRepository;
import com.k4ktyc.bustickets.repository.BusModelRepository;
import com.k4ktyc.bustickets.repository.BusRepository;
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
    private final BusRepository busRepository;

    @Autowired
    public BusService(BusClassRepository busClassRepository,
                      BusModelRepository busModelRepository,
                      BusRepository busRepository) {
        this.busClassRepository = busClassRepository;
        this.busModelRepository = busModelRepository;
        this.busRepository = busRepository;
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

    public void deleteModelById(long id) {
        busModelRepository.deleteById(id);
    }


    public BusDto save(BusDto busDto) {
        Bus bus = createBusFromDto(busDto);
        return createDtoFromBus(busRepository.save(bus));
    }

    public Page<BusDto> getBuses(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 20);
        Page<Bus> pagedBuses = busRepository.findAll(paging);

        return pagedBuses.map(this::createDtoFromBus);
    }

    public Page<BusDto> getBuses(boolean isUnpaged) {
        Page<Bus> unpagedBuses = busRepository.findAll(Pageable.unpaged());

        return unpagedBuses.map(this::createDtoFromBus);
    }

    public void deleteBusById(long id) {
        busRepository.deleteById(id);
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

    private BusDto createDtoFromBus(Bus bus) {
        BusDto dto = new BusDto();
        dto.setId(bus.getId());
        dto.setNumber(bus.getNumber());
        dto.setModel(createDtoFromModel(bus.getModel()));

        return dto;
    }

    private Bus createBusFromDto(BusDto dto) {
        Bus bus = new Bus();
        BusModel model = busModelRepository.findById(dto.getModelId()).get();

        bus.setNumber(dto.getNumber());
        bus.setModel(model);

        return bus;
    }
}

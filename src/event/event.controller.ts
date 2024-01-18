import { Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    // @Post('')
    // create() {
    //     return this.eventService.create()
    // }

    // @Get(':id')
    // getEvent(@Param('id') id: string) {
    //     return this.eventService.getEvent()
    // }

    @Get()
    getAllEvents(
        @Query('searchString') searchString: string = "",
        @Query('category') category: string = "",
    ) {
        return this.eventService.getAllEvents()
    }

    // @Patch(':id')
    // update(@Param('id') id: string) {
    //     return this.eventService.update()
    // }

    // @Delete(':id')
    // delete(@Param('id') id: string) {
    //     return this.eventService.delete()
    // }

}

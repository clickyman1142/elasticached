import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {AppService, IResponseDto} from './app.service';
import {StudentEntity} from "./entities/student.entity";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  public getGreeting(): string {
    return "Hello World";
  }

  @Get("/students")
  public async getStudents(): Promise<IResponseDto<Array<StudentEntity>>> {
    return this.appService.getStudents();
  }

  @Get("/students/:id")
  public async getStudent(
      @Param("id") id: string,
  ): Promise<IResponseDto<StudentEntity>> {
    return this.appService.getStudent(id);
  }

  @Post("/students")
  public async addStudent(
      @Body() body: {name: string, score: number}
  ): Promise<IResponseDto<StudentEntity>> {
    return this.appService.addStudent(body.name, body.score);
  }
}

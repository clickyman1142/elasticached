import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StudentEntity} from "./entities/student.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [StudentEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([StudentEntity])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

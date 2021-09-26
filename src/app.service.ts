import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {StudentEntity} from "./entities/student.entity";
import {RedisClient} from "redis";

const CACHE_EXPIRED_TIME_DEFAULT = 500;

const CACHE_KEY = {
    STUDENTS: "STUDENTS",
};

export interface IResponseDto<T> {
    message: string;
    data: T;
}

@Injectable()
export class AppService {
    private cache: RedisClient;
    constructor(
        @InjectRepository(StudentEntity)
        private studentRepo: Repository<StudentEntity>,
    ) {
        this.cache = new RedisClient({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        });
    }

    public async getStudents(): Promise<IResponseDto<Array<StudentEntity>>> {
        try {
            const dataFromCached: Array<StudentEntity> = await new Promise((resolve, _reject) => {
                this.cache.get(CACHE_KEY.STUDENTS, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    resolve(JSON.parse(data));
                });
            });
            if (!dataFromCached || dataFromCached.length === 0) {
                throw new Error("Can't empty");
            }
            return {
                message: "Return from cached",
                data: dataFromCached,
            };
        } catch (e) {
            const data = await this.studentRepo.find();
            this.cache.setex(CACHE_KEY.STUDENTS, CACHE_EXPIRED_TIME_DEFAULT, JSON.stringify(data));
            return {
                message: "Return from database",
                data,
            };
        }
    }

    public async getStudent(id: string): Promise<IResponseDto<StudentEntity>> {
        try {
            const dataFromCached: StudentEntity = await new Promise((resolve, _reject) => {
                this.cache.get(id, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    resolve(JSON.parse(data));
                });
            });
            if (!dataFromCached) {
                throw new Error("Can't empty");
            }
            return {
                message: "Return from cached",
                data: dataFromCached,
            };
        } catch (e) {
            const data = await this.studentRepo.findOne(id);
            this.cache.setex(data.id, CACHE_EXPIRED_TIME_DEFAULT, JSON.stringify(data));
            return {
                message: "Return from database",
                data,
            };
        }
    }

    public async addStudent(name: string, score: number): Promise<IResponseDto<StudentEntity>> {
        const rs = await this.studentRepo.insert({name, score});
        const generatedId = rs.raw[0].id;
        const insertedData = {name, score, id: generatedId} as StudentEntity;
        this.cache.setex(generatedId, CACHE_EXPIRED_TIME_DEFAULT, JSON.stringify(insertedData));
        return {
            message: "Successfully",
            data: insertedData,
        };
    }
}

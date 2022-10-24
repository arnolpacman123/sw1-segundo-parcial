import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const ormConfig: TypeOrmModuleOptions = {
    type: "postgres",
    url: 'postgres://vfzyqzaufhifts:f0b7771ec9fa1bfa1f5a96046ecb8e223713854492b82106e088d5633e7cb35d@ec2-3-220-207-90.compute-1.amazonaws.com:5432/d31ongttptqnah',
    synchronize: true,
    entities: ["dist/**/*.entity{.ts,.js}"],
    autoLoadEntities: true,
    ssl: {
        rejectUnauthorized: false,
    },
}
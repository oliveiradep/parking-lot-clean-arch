import ParkingLotAdapter from "../../adapter/ParkingLotAdapter";
import ParkingLot from "../../core/entity/ParkingLot";
import ParkingLotRepository from "../../core/repository/ParkingLotRepository";

import connection from "../database/Database";

export default class ParkingLotRepositorySQL implements ParkingLotRepository {
    async getParkingLot(code: string) : Promise<ParkingLot> {
        const parkingLot = await connection.query("select *, (select count(*) from parked_car pc where pc.code = pl.code) as occupied_spaces from parking_lot pl where pl.code = ?", [code]);
        return await ParkingLotAdapter.create(
            parkingLot[0][0].code, 
            parkingLot[0][0].capacity, 
            parkingLot[0][0].open_hour, 
            parkingLot[0][0].close_hour, 
            parkingLot[0][0].occupied_spaces
        );
    }

    async saveParkedCar(code: string, plate: string, date: Date) : Promise<void> {
        await connection.query("insert into parked_car (code, plate, date) values (?, ?, ?)", [code, plate, date]);
    }
}
import EnterParkingLot from "../src/core/usecase/EnterParkingLot";
import GetParkingLot from "../src/core/usecase/GetParkingLot";
import ParkingLotRepositoryMemory from "../src/infra/repository/ParkingLotRepositoryMemory";
import ParkingLotRepositorySQL from "../src/infra/repository/ParkingLotRepositorySQL";

import connection from "../src/infra/database/Database";

afterEach( async() => {
    await connection.query("DELETE FROM parked_car");
});

afterAll( async() => {
    connection.end();
});

//Memory

test("Should not enter parking lot because invalid plate", async function() {
    const parkingLotRepositoryMemory = new ParkingLotRepositoryMemory();

    const getParkingLot = new GetParkingLot(parkingLotRepositoryMemory);
    const parkingLotBeforeEnter = await getParkingLot.execute("gym");

    expect(parkingLotBeforeEnter.occupiedSpaces).toBe(0);

    const enterParkingLot = new EnterParkingLot(parkingLotRepositoryMemory);

    try {
        await enterParkingLot.execute("gym", "ABC-12345", new Date("2021-01-01T10:00:00"));
    } catch(e) {
        expect(e.message).toBe("Invalid plate.");
    }
});

test("Should enter parking lot", async function() {
    const parkingLotRepositoryMemory = new ParkingLotRepositoryMemory();

    const getParkingLot = new GetParkingLot(parkingLotRepositoryMemory);
    const parkingLotBeforeEnter = await getParkingLot.execute("gym");

    expect(parkingLotBeforeEnter.occupiedSpaces).toBe(0);

    const enterParkingLot = new EnterParkingLot(parkingLotRepositoryMemory);
    await enterParkingLot.execute("gym", "ABC-1234", new Date("2021-01-01T10:00:00"));
    const parkingLotAfterEnter = await getParkingLot.execute("gym");

    expect(parkingLotAfterEnter.occupiedSpaces).toBe(1);
});

test("Should be closed", async function() {
    const parkingLotRepositoryMemory = new ParkingLotRepositoryMemory();

    const getParkingLot = new GetParkingLot(parkingLotRepositoryMemory);
    const parkingLotBeforeEnter = await getParkingLot.execute("gym");

    expect(parkingLotBeforeEnter.occupiedSpaces).toBe(0);

    const enterParkingLot = new EnterParkingLot(parkingLotRepositoryMemory);

    try {
        await enterParkingLot.execute("gym", "ABC-1234", new Date("2021-01-01T05:00:00"));
    } catch(e) {
        expect(e.message).toBe("The parking lot is closed.");
    }
});

test("Should be full", async function() {
    const parkingLotRepositoryMemory = new ParkingLotRepositoryMemory();

    const getParkingLot = new GetParkingLot(parkingLotRepositoryMemory);
    const parkingLotBeforeEnter = await getParkingLot.execute("gym");

    expect(parkingLotBeforeEnter.occupiedSpaces).toBe(0);

    const enterParkingLot = new EnterParkingLot(parkingLotRepositoryMemory);
    await enterParkingLot.execute("gym", "ABC-1234", new Date("2021-01-01T10:00:00"));
    await enterParkingLot.execute("gym", "KLM-5678", new Date("2021-01-01T11:00:00"));
    const parkingLotAfterEnter = await getParkingLot.execute("gym");

    expect(parkingLotAfterEnter.occupiedSpaces).toBe(2);

    try {
        await enterParkingLot.execute("gym", "ZZZ-9999", new Date("2021-01-01T12:00:00"));
    } catch(e) {
        expect(e.message).toBe("The parking lot is full.");
    }
});

//SQL

test("Should get parking lot", async function() {
    const parkingLotRepositorySQL = new ParkingLotRepositorySQL();
    
    const getParkingLot = new GetParkingLot(parkingLotRepositorySQL);
    const parkingLot = await getParkingLot.execute("gym");

    expect(parkingLot.code).toBe("gym");
    expect(parkingLot.capacity).toBe(2);
    expect(parkingLot.openHour).toBe(6);
    expect(parkingLot.closeHour).toBe(22);
    expect(parkingLot.occupiedSpaces).toBe(0);
});

test("Should not enter parking lot because invalid plate", async function() {
    const parkingLotRepositorySQL = new ParkingLotRepositorySQL();

    const getParkingLot = new GetParkingLot(parkingLotRepositorySQL);
    const parkingLotBeforeEnter = await getParkingLot.execute("gym");

    expect(parkingLotBeforeEnter.occupiedSpaces).toBe(0);

    const enterParkingLot = new EnterParkingLot(parkingLotRepositorySQL);

    try {
        await enterParkingLot.execute("gym", "ABC-12345", new Date("2021-01-01T10:00:00"));
    } catch(e) {
        expect(e.message).toBe("Invalid plate.");
    }
});

test("Should enter parking lot", async function() {
    const parkingLotRepositorySQL = new ParkingLotRepositorySQL();
    
    const getParkingLot = new GetParkingLot(parkingLotRepositorySQL);
    const parkingLotBeforeEnter = await getParkingLot.execute("gym");

    expect(parkingLotBeforeEnter.occupiedSpaces).toBe(0);

    const enterParkingLot = new EnterParkingLot(parkingLotRepositorySQL);
    await enterParkingLot.execute("gym", "ABC-1234", new Date("2021-01-01T10:00:00"));
    const parkingLotAfterEnter = await getParkingLot.execute("gym");

    expect(parkingLotAfterEnter.occupiedSpaces).toBe(1);
});

test("Should be closed", async function() {
    const parkingLotRepositorySQL = new ParkingLotRepositorySQL();

    const getParkingLot = new GetParkingLot(parkingLotRepositorySQL);
    const parkingLotBeforeEnter = await getParkingLot.execute("gym");

    expect(parkingLotBeforeEnter.occupiedSpaces).toBe(0);

    const enterParkingLot = new EnterParkingLot(parkingLotRepositorySQL);

    try {
        await enterParkingLot.execute("gym", "KLM-5678", new Date("2021-01-01T05:00:00"));
    } catch(e) {
        expect(e.message).toBe("The parking lot is closed.");
    }
});

test("Should be full", async function() {
    const parkingLotRepositorySQL = new ParkingLotRepositorySQL();

    const getParkingLot = new GetParkingLot(parkingLotRepositorySQL);
    const parkingLotBeforeEnter = await getParkingLot.execute("gym");

    expect(parkingLotBeforeEnter.occupiedSpaces).toBe(0);

    const enterParkingLot = new EnterParkingLot(parkingLotRepositorySQL);
    await enterParkingLot.execute("gym", "ABC-1234", new Date("2021-01-01T10:00:00"));
    await enterParkingLot.execute("gym", "KLM-5678", new Date("2021-01-01T11:00:00"));
    const parkingLotAfterEnter = await getParkingLot.execute("gym");

    expect(parkingLotAfterEnter.occupiedSpaces).toBe(2);

    try {
        await enterParkingLot.execute("gym", "ZZZ-9999", new Date("2021-01-01T12:00:00"));
    } catch(e) {
        expect(e.message).toBe("The parking lot is full.");
    }
});
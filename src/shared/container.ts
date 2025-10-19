import { GuestController } from "@guest/controllers/guest.controller";
import { GuestService } from "@guest/services/guest.service";
import {
  GuestRepository,
  KyselyGuestRepository,
} from "@guest/repository/guest.repository";
import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { RoomSizeController } from "@room/controllers/room-size.controller";
import { RoomController } from "@room/controllers/room.controller";
import { RoomSizeRepository } from "@room/repositories/room-size.repository";
import {
  RoomRepository,
  KyselyRoomRepository,
} from "@room/repositories/room.repository";
import { RoomSizeService } from "@room/services/room-size.service";
import { RoomService } from "@room/services/room.service";
import { ExtraServiceService } from "@extraService/services/extra-service.service";
import { ExtraServiceController } from "@extraService/controllers/extra-service.controller";
import { ExtraServiceRepository } from "@extraService/repositories/extra-service.repository";
import { ReservationDetailController } from "@reservation/controllers/reservation-detail.controller";
import { ReservationController } from "@reservation/controllers/reservation.controller";
import { ReservationDetailRepository } from "@reservation/repositories/reservation-detail.repository";
import { ReservationRepository } from "@reservation/repositories/reservation.repository";
import { ReservationDetailService } from "@reservation/services/reservation-detail.service";
import { ReservationService } from "@reservation/services/reservation.service";
import { LogService } from "./services/log.service";
import { ExceptionService } from "./services/exception.service";
import { ErrorResponse } from "./exceptions/error-response";

function connectDatabase(databaseConfig: DatabaseConfig) {
  let dialect;
  if (databaseConfig.driver === "mysql") {
    dialect = new MysqlDialect({
      pool: createPool({
        host: databaseConfig.host,
        user: databaseConfig.user,
        database: databaseConfig.database,
        password: databaseConfig.password,
        port: databaseConfig.port,
      }),
    });
  }

  if (databaseConfig.driver === "postgre") {
  }
  return new Kysely({ dialect });
}

interface ContainerProps {
  database?: Kysely<any>;
  guestRepository?: GuestRepository;
  guestService?: GuestService;
  guestController?: GuestController;
  roomRepository?: RoomRepository;
  roomService?: RoomService;
  roomController?: RoomController;
  roomSizeRepository?: RoomSizeRepository;
  roomSizeService?: RoomSizeService;
  roomSizeController?: RoomSizeController;
  reservationRepository?: ReservationRepository;
  reservationService?: ReservationService;
  reservationController?: ReservationController;
  reservationDetailRepository?: ReservationDetailRepository;
  reservationDetailService?: ReservationDetailService;
  reservationDetailController?: ReservationDetailController;
  extraServiceRepository?: ExtraServiceRepository;
  extraServiceService?: ExtraServiceService;
  extraServiceController?: ExtraServiceController;
  logService?: LogService;
  exceptionService?: ExceptionService;
}
interface DatabaseConfig {
  driver: "mysql" | "postgre";
  host: string;
  user: string;
  database: string;
  password: string;
  port?: number;
}

interface LogConfig {
  logPath: string;
}

interface ContainerConfig {
  database: DatabaseConfig;
  log: LogConfig;
}
export class Container {
  private readonly props: ContainerProps = {};

  constructor(private readonly config: ContainerConfig) {}

  get database() {
    if (this.props.database) {
      return this.props.database;
    }

    this.props.database = connectDatabase(this.config.database);
    return this.props.database;
  }

  get guestRepository() {
    if (this.props.guestRepository) {
      return this.props.guestRepository;
    }
    this.props.guestRepository = new KyselyGuestRepository(this.database);
    return this.props.guestRepository;
  }

  get guestService() {
    if (this.props.guestService) {
      return this.props.guestService;
    }
    this.props.guestService = new GuestService(this.guestRepository);
    return this.props.guestService;
  }
  get guestController() {
    if (this.props.guestController) {
      return this.props.guestController;
    }
    this.props.guestController = new GuestController(
      this.guestService,
      this.exceptionService
    );
    return this.props.guestController;
  }
  get roomRepository() {
    if (this.props.roomRepository) {
      return this.props.roomRepository;
    }
    this.props.roomRepository = new KyselyRoomRepository(this.database);
    return this.props.roomRepository;
  }

  get roomService() {
    if (this.props.roomService) {
      return this.props.roomService;
    }
    this.props.roomService = new RoomService(this.roomRepository);
    return this.props.roomService;
  }
  get roomController() {
    if (this.props.roomController) {
      return this.props.roomController;
    }
    this.props.roomController = new RoomController(this.roomService);
    return this.props.guestController;
  }

  get logService() {
    if (this.props.logService) {
      return this.props.logService;
    }
    this.props.logService = new LogService(this.config.log, {});
    return this.props.logService;
  }

  get exceptionService() {
    if (this.props.exceptionService) {
      return this.props.exceptionService;
    }
    this.props.exceptionService = new ExceptionService(this.logService);
    return this.props.exceptionService;
  }
}

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
import {
  ExtraServiceRepository,
  KyselyExtraServiceRepository,
} from "@extraService/repositories/extra-service.repository";
import { ReservationDetailController } from "@reservation/controllers/reservation-detail.controller";
import { ReservationController } from "@reservation/controllers/reservation.controller";
import {
  KyselyReservationDetailRepository,
  ReservationDetailRepository,
} from "@reservation/repositories/reservation-detail.repository";
import {
  KyselyReservationRepository,
  ReservationRepository,
} from "@reservation/repositories/reservation.repository";
import { ReservationDetailService } from "@reservation/services/reservation-detail.service";
import { ReservationService } from "@reservation/services/reservation.service";
import { LogService } from "@shared/services/log.service";
import { ExceptionService } from "@shared/services/exception.service";
import { BookingService } from "./services/booking.service";
import { BookingController } from "./controllers/booking.controller";
import { EmailService, GmailEmailService } from "./services/email.service";
import {
  KyselySessionRepository,
  SessionRepository,
} from "@session/repositories/session.repository";
import { Session } from "inspector";
import { SessionService } from "@session/services/session.service";
import { LoginService } from "./services/login.service";
import { LoginController } from "./controllers/login.controller";

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
  bookingService?: BookingService;
  bookingController?: BookingController;
  emailService?: EmailService;
  sessionRespository?: SessionRepository;
  sessionService?: SessionService;
  loginService?: LoginService;
  loginController?: LoginController;
}
interface DatabaseConfig {
  driver: "mysql" | "postgre";
  host: string;
  user: string;
  database: string;
  password: string;
  port?: number;
}

interface EmailServiceConfig {
  email: string;
  password: string;
}

interface LogConfig {
  logPath: string;
}

interface ContainerConfig {
  database: DatabaseConfig;
  email: EmailServiceConfig;
  log: LogConfig;
}
export class Container {
  private readonly props: ContainerProps = {};

  constructor(private readonly config: ContainerConfig) {}

  get emailService() {
    if (this.props.emailService) {
      return this.props.emailService;
    }
    this.props.emailService = new GmailEmailService(this.config.email);
    return this.props.emailService;
  }

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
    return this.props.roomController;
  }
  get reservationRepository() {
    if (this.props.reservationRepository) {
      return this.props.reservationRepository;
    }
    this.props.reservationRepository = new KyselyReservationRepository(
      this.database
    );
    return this.props.reservationRepository;
  }

  get reservationService() {
    if (this.props.reservationService) {
      return this.props.reservationService;
    }
    this.props.reservationService = new ReservationService(
      this.reservationRepository
    );
    return this.props.reservationService;
  }
  get reservationController() {
    if (this.props.reservationController) {
      return this.props.reservationController;
    }
    this.props.reservationController = new ReservationController(
      this.reservationService
    );
    return this.props.reservationController;
  }

  get reservationDetailRepository() {
    if (this.props.reservationDetailRepository) {
      return this.props.reservationDetailRepository;
    }
    this.props.reservationDetailRepository =
      new KyselyReservationDetailRepository(this.database);
    return this.props.reservationDetailRepository;
  }

  get reservationDetailService() {
    if (this.props.reservationDetailService) {
      return this.props.reservationDetailService;
    }
    this.props.reservationDetailService = new ReservationDetailService(
      this.reservationDetailRepository
    );
    return this.props.reservationDetailService;
  }
  get reservationDetailController() {
    if (this.props.reservationDetailController) {
      return this.props.reservationDetailController;
    }
    this.props.reservationDetailController = new ReservationDetailController(
      this.reservationDetailService
    );
    return this.props.reservationDetailController;
  }

  get extraServiceRepository() {
    if (this.props.extraServiceRepository) {
      return this.props.extraServiceRepository;
    }
    this.props.extraServiceRepository = new KyselyExtraServiceRepository(
      this.database
    );
    return this.props.extraServiceRepository;
  }

  get extraServiceService() {
    if (this.props.extraServiceService) {
      return this.props.extraServiceService;
    }
    this.props.extraServiceService = new ExtraServiceService(
      this.extraServiceRepository
    );
    return this.props.extraServiceService;
  }

  get extraServiceController() {
    if (this.props.extraServiceController) {
      return this.props.extraServiceController;
    }
    this.props.extraServiceController = new ExtraServiceController(
      this.extraServiceService
    );
    return this.props.extraServiceController;
  }

  get logService() {
    if (this.props.logService) {
      return this.props.logService;
    }
    this.props.logService = new LogService(this.config.log);
    return this.props.logService;
  }

  get exceptionService() {
    if (this.props.exceptionService) {
      return this.props.exceptionService;
    }
    this.props.exceptionService = new ExceptionService(this.logService);
    return this.props.exceptionService;
  }

  get bookingService() {
    if (this.props.bookingService) {
      return this.props.bookingService;
    }
    this.props.bookingService = new BookingService(
      this.database,
      this.guestService,
      this.roomService,
      this.extraServiceService,
      this.reservationService,
      this.reservationDetailService,
      this.emailService
    );
    return this.props.bookingService;
  }

  get bookingController() {
    if (this.props.bookingController) {
      return this.props.bookingController;
    }
    this.props.bookingController = new BookingController(this.bookingService);
    return this.props.bookingController;
  }

  get sessionRepository() {
    if (this.props.sessionRespository) {
      return this.props.sessionRespository;
    }
    this.props.sessionRespository = new KyselySessionRepository(this.database);
    return this.props.sessionRespository;
  }

  get sessionService() {
    if (this.props.sessionService) {
      return this.props.sessionService;
    }
    this.props.sessionService = new SessionService(this.sessionRepository);
    return this.props.sessionService;
  }

  get loginService() {
    if (this.props.loginService) {
      return this.props.loginService;
    }
    this.props.loginService = new LoginService(
      this.guestService,
      this.sessionService
    );
    return this.props.loginService;
  }

  get loginController() {
    if (this.props.loginController) {
      return this.props.loginController;
    }
    this.props.loginController = new LoginController(this.loginService);
    return this.props.loginController;
  }
}

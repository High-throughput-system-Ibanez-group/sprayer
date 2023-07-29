#define STEPPER_X_STP 21
#define STEPPER_X_DIR 20
#define STEPPER_X_POW 19
#define STEPPER_X_LIMIT_START 59
#define STEPPER_X_LIMIT_END 58

#define STEPPER_Y_STP 18
#define STEPPER_Y_DIR 16
#define STEPPER_Y_POW 17
#define STEPPER_Y_LIMIT_START 57
#define STEPPER_Y_LIMIT_END 56

#define STEPPER_Z_STP 3
#define STEPPER_Z_DIR 50
#define STEPPER_Z_POW 51
#define STEPPER_Z_LIMIT_START 55
#define STEPPER_Z_LIMIT_END 24

#define STEPPER_SYRINGE_STP 52
#define STEPPER_SYRINGE_DIR 2
#define STEPPER_SYRINGE_POW 36
#define STEPPER_SYRINGE_LIMIT_START 22
#define STEPPER_SYRINGE_LIMIT_END 23
#define SYRINGE_FULL_REV_MM 1

#define PRESSURE_REGULATOR_OUT 6
#define PRESSURE_REGULATOR_IN 54

#define SOLENOID_VALVE_SYRINGE_1 40
#define SOLENOID_VALVE_SYRINGE_2 39

// commands
#define STEPPER_COMMAND 0x41
#define SET_PRESSURE_COMMAND 0x42
#define SEND_PRESSURE_COMMAND 0x43
#define SET_VALVE_COMMMAND 0x44
#define STEPPER_X_STOPPED 0x45
#define STEPPER_Y_STOPPED 0x46
#define STEPPER_Z_STOPPED 0x47
#define STEPPER_S_STOPPED 0x48

struct stepper
{
  int stp;
  int dir;
  int pow;
  int limit_start;
  int limit_end;
  int steps;
  int free_rotate;
  int disable;
  int step_sleep_millis;
  int pending_steps;
  int toggle;
  unsigned long next_step_time;
};

stepper stepper_x;
stepper stepper_y;
stepper stepper_z;
stepper stepper_s; // syringe

void setup()
{
  stepper_x.stp = STEPPER_X_STP;
  stepper_x.dir = STEPPER_X_DIR;
  stepper_x.pow = STEPPER_X_POW;
  stepper_x.limit_start = STEPPER_X_LIMIT_START;
  stepper_x.limit_end = STEPPER_X_LIMIT_END;
  setup_stepper(stepper_x);

  stepper_y.stp = STEPPER_Y_STP;
  stepper_y.dir = STEPPER_Y_DIR;
  stepper_y.pow = STEPPER_Y_POW;
  stepper_y.limit_start = STEPPER_Y_LIMIT_START;
  stepper_y.limit_end = STEPPER_Y_LIMIT_END;
  setup_stepper(stepper_y);

  stepper_z.stp = STEPPER_Z_STP;
  stepper_z.dir = STEPPER_Z_DIR;
  stepper_z.pow = STEPPER_Z_POW;
  stepper_z.limit_start = STEPPER_Z_LIMIT_START;
  stepper_z.limit_end = STEPPER_Z_LIMIT_END;
  setup_stepper(stepper_z);

  stepper_s.stp = STEPPER_SYRINGE_STP;
  stepper_s.dir = STEPPER_SYRINGE_DIR;
  stepper_s.pow = STEPPER_SYRINGE_POW;
  stepper_s.limit_start = STEPPER_SYRINGE_LIMIT_START;
  stepper_s.limit_end = STEPPER_SYRINGE_LIMIT_END;
  setup_stepper(stepper_s);

  // config pressure regulator
  pinMode(PRESSURE_REGULATOR_IN, INPUT);
  pinMode(PRESSURE_REGULATOR_OUT, OUTPUT);
  analogWrite(PRESSURE_REGULATOR_OUT, 0);

  // config solenoid valve syringe 1
  pinMode(SOLENOID_VALVE_SYRINGE_1, OUTPUT);
  digitalWrite(SOLENOID_VALVE_SYRINGE_1, LOW);

  // config solenoid valve syringe 2
  pinMode(SOLENOID_VALVE_SYRINGE_2, OUTPUT);
  digitalWrite(SOLENOID_VALVE_SYRINGE_2, LOW);

  Serial.begin(9600);
}

void setup_stepper(stepper stepper)
{
  pinMode(stepper.stp, OUTPUT);
  digitalWrite(stepper.stp, LOW);

  pinMode(stepper.dir, OUTPUT);
  digitalWrite(stepper.dir, LOW);

  pinMode(stepper.pow, OUTPUT);
  digitalWrite(stepper.pow, LOW);

  pinMode(stepper.limit_start, INPUT);
  pinMode(stepper.limit_end, INPUT);
}

int get_command_arg(String command, int argIndex)
{
  int separatorIndex = 0;
  for (int i = 0; i < argIndex; i++)
  {
    separatorIndex = command.indexOf(':', separatorIndex + 1);
    if (separatorIndex == -1)
    {
      return 0;
    }
  }
  String arg = command.substring(separatorIndex + 1, command.indexOf(':', separatorIndex + 1));
  // Serial.println("arg index " + String(argIndex) + " : " + arg);
  return arg.toInt();
}

void rotate_stepper(stepper &stepper)
{
  if (stepper.disable)
  {
    stepper.pending_steps = 0;
    stepper.free_rotate = 0;
    digitalWrite(stepper.pow, LOW);
  }
  else if ((stepper.pending_steps > 0 || stepper.free_rotate) && (stepper.next_step_time < millis()))
  {
    stepper.next_step_time = millis() + stepper.step_sleep_millis;

    digitalWrite(stepper.stp, stepper.toggle);

    stepper.toggle = !stepper.toggle;

    if (stepper.free_rotate)
    {
      // count_steps(stepper);
    }
    else
    {
      stepper.pending_steps -= 1;
    }
  }
}

// void count_steps(stepper &stepper)
// {
//   if (active_sequence.startsWith("wspace_"))
//   {
//     sequence *wspace_ptr = stepper.axis == 'x' ? &wspace_x : stepper.axis == 'y' ? &wspace_y
//                                                                                  : &wspace_z;

//     if (wspace_ptr->current_move == 3)
//     {
//       wspace_ptr->steps++;
//     }
//   }
// }

void check_limits()
{
  check_limit(stepper_x);
  check_limit(stepper_y);
  check_limit(stepper_z);
  check_limit(stepper_s);
}

void check_limit(stepper &stepper)
{
  int limit_start = digitalRead(stepper.limit_start);
  int limit_end = digitalRead(stepper.limit_end);
  int stepper_dir = digitalRead(stepper.dir);

  if ((stepper.pending_steps > 0 || stepper.free_rotate) && ((!limit_start && !stepper_dir) || (!limit_end && stepper_dir)))
  {
    stepper.pending_steps = 0;
    stepper.free_rotate = false;
  }
}

void set_pressure_regulator(int val)
{
  analogWrite(PRESSURE_REGULATOR_OUT, val);
}

void set_solenoid_valve_syringe(int syringe, int val)
{
  if (syringe == 1)
  {
    digitalWrite(SOLENOID_VALVE_SYRINGE_1, val);
  }
  else if (syringe == 2)
  {
    digitalWrite(SOLENOID_VALVE_SYRINGE_2, val);
  }
}

void setup_stepper(int stepper_val, int dir, int free_rotate, int steps, int stop, int step_sleep_millis, int disable)
{
  stepper steppers[] = {stepper_x, stepper_y, stepper_z, stepper_s};
  stepper *stepper_ptr = &steppers[stepper_val];

  digitalWrite(stepper_ptr->dir, dir);
  stepper_ptr->free_rotate = free_rotate;
  stepper_ptr->steps = steps;
  stepper_ptr->step_sleep_millis = step_sleep_millis;
  stepper_ptr->disable = disable;
}

void check_steppers()
{
  rotate_stepper(stepper_x);
  rotate_stepper(stepper_y);
  rotate_stepper(stepper_z);
  rotate_stepper(stepper_s);
}

// Define command structures
struct StepperCommand
{
  byte command_code;
  int stepper_val;
  int dir;
  int free_rotate;
  int steps;
  int stop;
  int step_sleep_millis;
  int disable;
};

struct SetPressureCommand
{
  byte command_code;
  int val;
};

struct SetValveCommand
{
  byte command_code;
  int valve;
  int val;
};

struct SendPressureCommand
{
  byte command_code;
};

// Define command processing function
void process_command(byte command_code, byte *data, int length)
{
  switch (command_code)
  {
  case STEPPER_COMMAND:
  {
    if (length != sizeof(StepperCommand))
    {
      // Invalid command length
      return;
    }
    StepperCommand *cmd = (StepperCommand *)data;
    setup_stepper(cmd->stepper_val, cmd->dir, cmd->free_rotate, cmd->steps, cmd->stop, cmd->step_sleep_millis, cmd->disable);
    break;
  }
  case SET_PRESSURE_COMMAND:
  {
    if (length != sizeof(SetPressureCommand))
    {
      // Invalid command length
      return;
    }
    SetPressureCommand *cmd = (SetPressureCommand *)data;
    set_pressure_regulator(cmd->val);
    // Handle pressure regulator command
    break;
  }
  case SET_VALVE_COMMMAND:
  {
    if (length != sizeof(SetValveCommand))
    {
      // Invalid command length
      return;
    }
    SetValveCommand *cmd = (SetValveCommand *)data;
    set_solenoid_valve_syringe(cmd->valve, cmd->val);
    break;
    // Add more commands as needed
  }
  case SEND_PRESSURE_COMMAND:
  {
    if (length != sizeof(SendPressureCommand))
    {
      // Invalid command length
      return;
    }
    int V2 = analogRead(PRESSURE_REGULATOR_IN);
    byte message[] = {SEND_PRESSURE_COMMAND, (byte)(V2 >> 8), (byte)V2};
    Serial.write(message, sizeof(message));
    break;
  }
  default:
    // Invalid command
    break;
  }
}

// Define serial input buffer
byte serial_buffer[256];
int serial_buffer_pos = 0;

// Define serial input processing function
void process_serial_input()
{
  while (Serial.available() > 0)
  {
    byte b = Serial.read();
    if (serial_buffer_pos == 0 && b != 0xFF)
    {
      // Discard invalid data
      continue;
    }
    serial_buffer[serial_buffer_pos++] = b;
    if (serial_buffer_pos == 3)
    {
      // Command header received
      byte command_code = serial_buffer[1];
      int length = serial_buffer[2];
      if (length > 0)
      {
        // Wait for command data
        continue;
      }
      // Process command with no data
      process_command(command_code, NULL, 0);
      serial_buffer_pos = 0;
    }
    else if (serial_buffer_pos > 3)
    {
      // Command data received
      int length = serial_buffer[2];
      if (serial_buffer_pos == length + 3)
      {
        // All command data received
        process_command(serial_buffer[1], &serial_buffer[3], length);
        serial_buffer_pos = 0;
      }
    }
  }
}

// void read_serial_command()
// {
//   if (Serial.available() > 0)
//   {
//     String command = Serial.readStringUntil('\n');

//     switch (command.charAt(0))
//     {
//     case STEPPER_COMMAND:
//       setup_stepper(get_command_arg(command, 1),
//                     get_command_arg(command, 2),
//                     get_command_arg(command, 3),
//                     get_command_arg(command, 4),
//                     get_command_arg(command, 5),
//                     get_command_arg(command, 6),
//                     get_command_arg(command, 7));
//       break;

//     case SET_PRESSURE_COMMAND:
//       set_pressure_regulator(get_command_arg(command, 1));
//       break;

//     case SET_SOLENOID_VALVE_SYRINGE:
//       set_solenoid_valve_syringe(get_command_arg(command, 1), get_command_arg(command, 2));
//       break;

//     case SEND_PRESSURE_REGULATOR:
//       int V2 = analogRead(PRESSURE_REGULATOR_IN);
//       byte message[] = {SEND_PRESSURE_REGULATOR, (byte)(V2 >> 8), (byte)V2};
//       Serial.write(message, sizeof(message));
//       break;

//     default:
//       Serial.println("Unknown command");
//       break;
//     }
//   }
// }

void loop()
{
  process_serial_input();

  check_limits();

  check_steppers();

  delay(1);
}

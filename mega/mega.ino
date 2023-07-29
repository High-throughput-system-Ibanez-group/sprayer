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
#define GET_PRESSURE_COMMAND 0x43
#define SET_VALVE_COMMMAND 0x44
#define STEPPER_STOPPED_COMMAND 0x45
#define STEPPER_DISABLED_COMMAND 0x46
#define GET_STEPPER_STEPS_COMMAND 0x47

struct stepper
{
  int name; // 0->x, 1->y, 2->z, 3->s
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
  int count_steps;
  int total_steps;
};

stepper stepper_x;
stepper stepper_y;
stepper stepper_z;
stepper stepper_s; // syringe

stepper steppers[] = {stepper_x, stepper_y, stepper_z, stepper_s};

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

void disable_stepper(stepper &stepper)
{
  stepper.disable = 0;
  stop_stepper(stepper);
  digitalWrite(stepper.pow, LOW);

  // send message
  byte message[3];
  message[0] = STEPPER_DISABLED_COMMAND;
  message[1] = (stepper.name >> 8) & 0xFF; // high byte
  message[2] = stepper.name & 0xFF;        // low byte
  Serial.write(message, sizeof(message));
}

void rotate_stepper(stepper &stepper)
{
  if (stepper.disable)
  {
    disable_stepper(stepper);
  }
  else if ((stepper.pending_steps > 0 || stepper.free_rotate) && (stepper.next_step_time < millis()))
  {
    stepper.next_step_time = millis() + stepper.step_sleep_millis;

    digitalWrite(stepper.stp, stepper.toggle);

    stepper.toggle = !stepper.toggle;

    if (stepper.free_rotate && stepper.count_steps)
    {
      stepper.total_steps++;
    }
    else
    {
      stepper.pending_steps -= 1;
    }
  }
}

void check_limits()
{
  check_limit(stepper_x);
  check_limit(stepper_y);
  check_limit(stepper_z);
  check_limit(stepper_s);
}

void stop_stepper(stepper &stepper)
{
  stepper.pending_steps = 0;
  stepper.free_rotate = 0;

  // send message
  byte message[3];
  message[0] = STEPPER_STOPPED_COMMAND;
  message[1] = (stepper.name >> 8) & 0xFF; // high byte
  message[2] = stepper.name & 0xFF;        // low byte
  Serial.write(message, sizeof(message));
}

void check_limit(stepper &stepper)
{
  int limit_start = digitalRead(stepper.limit_start);
  int limit_end = digitalRead(stepper.limit_end);
  int stepper_dir = digitalRead(stepper.dir);

  if ((stepper.pending_steps > 0 || stepper.free_rotate) && ((!limit_start && !stepper_dir) || (!limit_end && stepper_dir)))
  {
    stop_stepper(stepper);
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

void setup_stepper(int name, int dir, int free_rotate, int steps, int stop, int step_sleep_millis, int disable, int count_steps)
{
  stepper *stepper_ptr = &steppers[name];

  digitalWrite(stepper_ptr->dir, dir);
  stepper_ptr->name = name;
  stepper_ptr->free_rotate = free_rotate;
  stepper_ptr->pending_steps = steps;
  stepper_ptr->total_steps = 0;
  stepper_ptr->step_sleep_millis = step_sleep_millis;
  stepper_ptr->disable = disable;
  stepper_ptr->count_steps = count_steps;
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
  int name;
  int dir;
  int free_rotate;
  int steps;
  int stop;
  int step_sleep_millis;
  int disable;
  int count_steps;
};

struct SetPressureCommand
{
  byte command_code;
  int val;
};

struct SetValveCommand
{
  byte command_code;
  int name;
  int val;
};

struct SendPressureCommand
{
  byte command_code;
};

struct GetStepperStepsCommand
{
  byte command_code;
  int name;
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
    setup_stepper(cmd->name, cmd->dir, cmd->free_rotate, cmd->steps, cmd->stop, cmd->step_sleep_millis, cmd->disable, cmd->count_steps);
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
    set_solenoid_valve_syringe(cmd->name, cmd->val);
    break;
    // Add more commands as needed
  }
  case GET_PRESSURE_COMMAND:
  {
    if (length != sizeof(SendPressureCommand))
    {
      // Invalid command length
      return;
    }
    int V2 = analogRead(PRESSURE_REGULATOR_IN);
    byte message[] = {GET_PRESSURE_COMMAND, (byte)(V2 >> 8), (byte)V2};
    Serial.write(message, sizeof(message));
    break;
  }
  case GET_STEPPER_STEPS_COMMAND:
  {
    if (length != sizeof(GetStepperStepsCommand))
    {
      // Invalid command length
      return;
    }
    GetStepperStepsCommand *cmd = (GetStepperStepsCommand *)data;
    stepper *stepper_ptr = &steppers[cmd->name];
    byte message[] = {GET_STEPPER_STEPS_COMMAND, (byte)(stepper_ptr->steps >> 8), (byte)stepper_ptr->steps};
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

void loop()
{
  process_serial_input();

  check_limits();

  check_steppers();

  delay(1);
}

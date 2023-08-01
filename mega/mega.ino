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

void setup_stepper(int name, int dir, int free_rotate, int steps, int step_sleep_millis, int disable, int count_steps)
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
void process_command(int command_code, int num_args)
{
  // Process the command received from Node.js based on command code and number of arguments
  switch (command_code)
  {
  case STEPPER_COMMAND:
    if (num_args == 7)
    {
      int arg1 = Serial.parseInt();
      int arg2 = Serial.parseInt();
      int arg3 = Serial.parseInt();
      int arg4 = Serial.parseInt();
      int arg5 = Serial.parseInt();
      int arg6 = Serial.parseInt();
      int arg7 = Serial.parseInt();

      // Handle Command 0x41 with 2 arguments (arg1 and arg2)
      // Add your code here to perform specific actions
      Serial.print("Received Command 0x41 - Argument 1: ");
      Serial.print(arg1);
      Serial.print(", Argument 2: ");
      Serial.println(arg2);
      Serial.print(", Argument 3: ");
      Serial.println(arg3);
      Serial.print(", Argument 4: ");
      Serial.println(arg4);
      Serial.print(", Argument 5: ");
      Serial.println(arg5);
      Serial.print(", Argument 6: ");
      Serial.println(arg6);
      Serial.print(", Argument 7: ");
      Serial.println(arg7);
    }
    else
    {
      // Invalid number of arguments for Command 0x41
      Serial.println("Invalid number of arguments for Command 0x41");
    }
    break;
  case SET_PRESSURE_COMMAND:
    if (num_args == 1)
    {
      int arg1 = Serial.parseInt();
      // Handle Command 0x42 with 1 argument (arg1)
      // Add your code here to perform specific actions
      Serial.print("Received Command 0x42 - Argument 1: ");
      Serial.println(arg1);
    }
    else
    {
      // Invalid number of arguments for Command 0x42
      Serial.println("Invalid number of arguments for Command 0x42");
    }
    break;
  case SET_VALVE_COMMMAND:
    if (num_args == 2)
    {
      int arg1 = Serial.parseInt();
      int arg2 = Serial.parseInt();
      // Handle Command 0x43 with 2 arguments (arg1 and arg2)
      // Add your code here to perform specific actions
      Serial.print("Received Command 0x43 - Argument 1: ");
      Serial.print(arg1);
      Serial.print(", Argument 2: ");
      Serial.println(arg2);
    }
    else
    {
      // Invalid number of arguments for Command 0x43
      Serial.println("Invalid number of arguments for Command 0x43");
    }
    break;

  default:
    // Invalid command code
    Serial.println("Invalid command code");
    break;
  }
}
// Define serial input buffer
byte serial_buffer[256];
int serial_buffer_pos = 0;

// Define serial input processing function
void process_serial_input()
{
  if (Serial.available())
  {
    int command_code;
    int num_args;

    if (Serial.peek() == '0' && Serial.read() == 'x')
    {
      // Read the hexadecimal value as a string
      char hexString[9]; // Assuming 8-bit integers (4 characters for 32-bit integers + 1 for null terminator)
      for (int i = 0; i < sizeof(hexString) - 1; i++)
      {
        char c = Serial.peek();
        if (isHexadecimalDigit(c))
        {
          hexString[i] = Serial.read();
        }
        else
        {
          // Invalid hexadecimal format
          return;
        }
      }
      hexString[sizeof(hexString) - 1] = '\0';

      // Convert the hexadecimal string to an integer
      command_code = strtol(hexString, NULL, 16);
    }
    else
    {
      // Invalid command format
      return;
    }

    num_args = Serial.parseInt();

    // Process the command with the appropriate number of arguments
    process_command(command_code, num_args);
  }
}

void loop()
{
  process_serial_input();

  check_limits();

  check_steppers();

  delay(1);
}

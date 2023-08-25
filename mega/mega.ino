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

#define VALVE_SYRINGE_1 40
#define VALVE_SYRINGE_2 39

// commands
#define STEPPER_COMMAND_X 0x41
#define STEPPER_COMMAND_Y 0x42
#define STEPPER_COMMAND_Z 0x43
#define STEPPER_COMMAND_S 0x44
#define SET_PRESSURE_COMMAND 0x45
#define GET_PRESSURE_COMMAND 0x46
#define SET_VALVE_COMMMAND_1 0x47
#define SET_VALVE_COMMMAND_2 0x48
#define GET_STEPPER_STEPS_COMMAND_X 0x49
#define GET_STEPPER_STEPS_COMMAND_Y 0x4A
#define GET_STEPPER_STEPS_COMMAND_Z 0x4B
#define FINISH_COMMAND 0xFF

struct stepper
{
  int command;
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

stepper *steppers[] = {&stepper_x, &stepper_y, &stepper_z, &stepper_s};

void setup()
{
  stepper_x.stp = STEPPER_X_STP;
  stepper_x.dir = STEPPER_X_DIR;
  stepper_x.pow = STEPPER_X_POW;
  stepper_x.limit_start = STEPPER_X_LIMIT_START;
  stepper_x.limit_end = STEPPER_X_LIMIT_END;
  stepper_x.command = STEPPER_COMMAND_X;
  setup_stepper(stepper_x);

  stepper_y.stp = STEPPER_Y_STP;
  stepper_y.dir = STEPPER_Y_DIR;
  stepper_y.pow = STEPPER_Y_POW;
  stepper_y.limit_start = STEPPER_Y_LIMIT_START;
  stepper_y.limit_end = STEPPER_Y_LIMIT_END;
  stepper_y.command = STEPPER_COMMAND_Y;
  setup_stepper(stepper_y);

  stepper_z.stp = STEPPER_Z_STP;
  stepper_z.dir = STEPPER_Z_DIR;
  stepper_z.pow = STEPPER_Z_POW;
  stepper_z.limit_start = STEPPER_Z_LIMIT_START;
  stepper_z.limit_end = STEPPER_Z_LIMIT_END;
  stepper_z.command = STEPPER_COMMAND_Z;
  setup_stepper(stepper_z);

  stepper_s.stp = STEPPER_SYRINGE_STP;
  stepper_s.dir = STEPPER_SYRINGE_DIR;
  stepper_s.pow = STEPPER_SYRINGE_POW;
  stepper_s.limit_start = STEPPER_SYRINGE_LIMIT_START;
  stepper_s.limit_end = STEPPER_SYRINGE_LIMIT_END;
  stepper_s.command = STEPPER_COMMAND_S;
  setup_stepper(stepper_s);

  // config pressure regulator
  pinMode(PRESSURE_REGULATOR_IN, INPUT);
  pinMode(PRESSURE_REGULATOR_OUT, OUTPUT);
  analogWrite(PRESSURE_REGULATOR_OUT, 0);

  // config valve syringe 1
  pinMode(VALVE_SYRINGE_1, OUTPUT);
  digitalWrite(VALVE_SYRINGE_1, LOW);

  // config valve syringe 2
  pinMode(VALVE_SYRINGE_2, OUTPUT);
  digitalWrite(VALVE_SYRINGE_2, LOW);

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
}

void rotate_stepper(stepper &stepper)
{
  if (stepper.disable)
  {
    disable_stepper(stepper);
    Serial.println(String(FINISH_COMMAND) + ":" + String(stepper.command));
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
      if (stepper.pending_steps == 0)
      {
        Serial.println(String(FINISH_COMMAND) + ":" + String(stepper.command));
      }
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
  Serial.println(String(FINISH_COMMAND) + ":" + String(stepper.command));
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
  Serial.println(String(FINISH_COMMAND) + ":" + String(SET_PRESSURE_COMMAND));
}

void set_valve_syringe_1(int val)
{
  digitalWrite(VALVE_SYRINGE_1, val);
  Serial.println(String(FINISH_COMMAND) + ":" + String(SET_VALVE_COMMMAND_1));
}

void set_valve_syringe_2(int val)
{
  digitalWrite(VALVE_SYRINGE_2, val);
  Serial.println(String(FINISH_COMMAND) + ":" + String(SET_VALVE_COMMMAND_2));
}

void set_stepper(stepper *stepper, int dir, int free_rotate, int steps, int step_sleep_millis, int disable, int count_steps)
{
  digitalWrite(stepper->dir, dir);
  stepper->free_rotate = free_rotate;
  stepper->pending_steps = steps;
  stepper->total_steps = 0;
  stepper->step_sleep_millis = step_sleep_millis;
  stepper->disable = disable;
  stepper->count_steps = count_steps;
}

void check_steppers()
{
  rotate_stepper(stepper_x);
  rotate_stepper(stepper_y);
  rotate_stepper(stepper_z);
  rotate_stepper(stepper_s);
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

// Define serial input processing function
void process_serial_input()
{
  if (Serial.available() > 0)
  {
    String command = Serial.readStringUntil('\n');

    switch (command.charAt(0))
    {
    case STEPPER_COMMAND_X:
      set_stepper(&stepper_x, get_command_arg(command, 1), get_command_arg(command, 2), get_command_arg(command, 3), get_command_arg(command, 4), get_command_arg(command, 5), get_command_arg(command, 6));
      break;
    case STEPPER_COMMAND_Y:
      set_stepper(&stepper_y, get_command_arg(command, 1), get_command_arg(command, 2), get_command_arg(command, 3), get_command_arg(command, 4), get_command_arg(command, 5), get_command_arg(command, 6));
      break;
    case STEPPER_COMMAND_Z:
      set_stepper(&stepper_z, get_command_arg(command, 1), get_command_arg(command, 2), get_command_arg(command, 3), get_command_arg(command, 4), get_command_arg(command, 5), get_command_arg(command, 6));
      break;
    case STEPPER_COMMAND_S:
      set_stepper(&stepper_s, get_command_arg(command, 1), get_command_arg(command, 2), get_command_arg(command, 3), get_command_arg(command, 4), get_command_arg(command, 5), get_command_arg(command, 6));
      break;
    case SET_PRESSURE_COMMAND:
      set_pressure_regulator(get_command_arg(command, 1));
      break;
    case SET_VALVE_COMMMAND_1:
      set_valve_syringe_1(get_command_arg(command, 1));
      break;
    case SET_VALVE_COMMMAND_2:
      set_valve_syringe_2(get_command_arg(command, 1));
      break;
    case GET_STEPPER_STEPS_COMMAND_X:
      Serial.println(String(FINISH_COMMAND) + ':' + String(GET_STEPPER_STEPS_COMMAND_X) + ':' + String(stepper_x.total_steps));
      break;
    case GET_STEPPER_STEPS_COMMAND_Y:
      Serial.println(String(FINISH_COMMAND) + ':' + String(GET_STEPPER_STEPS_COMMAND_Y) + ':' + String(stepper_y.total_steps));
      break;
    case GET_STEPPER_STEPS_COMMAND_Z:
      Serial.println(String(FINISH_COMMAND) + ':' + String(GET_STEPPER_STEPS_COMMAND_Z) + ':' + String(stepper_z.total_steps));
      break;
    case GET_PRESSURE_COMMAND:
      Serial.println(String(FINISH_COMMAND) + ':' + String(GET_PRESSURE_COMMAND) + ':' + String(analogRead(PRESSURE_REGULATOR_IN)));
      break;
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

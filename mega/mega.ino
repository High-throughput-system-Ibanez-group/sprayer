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

stepper *steppers[] = {&stepper_x, &stepper_y, &stepper_z, &stepper_s};

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

  // TODO: Send stop message
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

void set_stepper(stepper *stepper, int name, int dir, int free_rotate, int steps, int step_sleep_millis, int disable, int count_steps)
{
  Serial.println("set_stepper");
  digitalWrite(stepper->dir, dir);
  stepper->name = name;
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
    case STEPPER_COMMAND:
      int name = get_command_arg(command, 1);
      set_stepper(steppers[name], name, get_command_arg(command, 2), get_command_arg(command, 3), get_command_arg(command, 4), get_command_arg(command, 5), get_command_arg(command, 6), get_command_arg(command, 7));
      break;
    case SET_PRESSURE_COMMAND:
      set_pressure_regulator(get_command_arg(command, 1));
      break;
    case SET_VALVE_COMMMAND:
      set_solenoid_valve_syringe(get_command_arg(command, 1), get_command_arg(command, 2));
      break;
    case GET_STEPPER_STEPS_COMMAND:
      int stepper_name = get_command_arg(command, 1);
      // TODO: send stepper steps
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

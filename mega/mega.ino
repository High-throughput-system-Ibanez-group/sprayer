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

#define FULL_REV_MM_X_Y 54
#define FULL_REV_MM_Z 44
#define STEP_SLEEP_MICRO 8000
#define STEP_SLEEP_MILLI 8
#define STEP_SLEEP_MILLI_SYRINGE 4

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

struct stepper
{
  int stp;
  int dir;
  int pow;
  int limit_start;
  int limit_end;
  double linear_mov;
  int pending_steps;
  bool keep_engaged;
  bool active;
  bool first_active;
  bool toggle;
  bool free_rotate;
  unsigned long next_step_time;
  char axis;
  int step_sleep_milli;
  int full_rev_mm;
  int microstepping;
};

struct sequence
{
  int number_of_repetitions;
  int current_repetition;
  bool active;
  int steps;
  int current_move;
  double vertical_mov_mm;
  double horizontal_mov_mm;
  double total_vertical_mm;
  double current_vertical_mm;
  bool should_move_horizontal;
  char axis;
  stepper *stepper;
};

stepper stepper_x;
stepper stepper_y;
stepper stepper_z;
stepper stepper_syringe;

sequence clean_sequence;
sequence pattern_sequence;
sequence wspace_x;
sequence wspace_y;
sequence wspace_z;
sequence standby_motors;

String active_sequence = "-"; // default value

void setup()
{
  stepper_x.stp = STEPPER_X_STP;
  stepper_x.dir = STEPPER_X_DIR;
  stepper_x.pow = STEPPER_X_POW;
  stepper_x.limit_start = STEPPER_X_LIMIT_START;
  stepper_x.limit_end = STEPPER_X_LIMIT_END;
  stepper_x.linear_mov = 0.0675; // 54/800
  stepper_x.keep_engaged = true;
  stepper_x.pending_steps = 0;
  stepper_x.active = false;
  stepper_x.first_active = false;
  stepper_x.toggle = true;
  stepper_x.next_step_time = 0;
  stepper_x.free_rotate = false;
  stepper_x.axis = 'x';
  stepper_x.step_sleep_milli = STEP_SLEEP_MILLI;
  stepper_x.full_rev_mm = FULL_REV_MM_X_Y;
  stepper_x.microstepping = 400;
  setup_stepper(stepper_x);

  stepper_y.stp = STEPPER_Y_STP;
  stepper_y.dir = STEPPER_Y_DIR;
  stepper_y.pow = STEPPER_Y_POW;
  stepper_y.limit_start = STEPPER_Y_LIMIT_START;
  stepper_y.limit_end = STEPPER_Y_LIMIT_END;
  stepper_y.linear_mov = 0.0675; // 54/800
  stepper_y.keep_engaged = false;
  stepper_y.pending_steps = 0;
  stepper_y.active = false;
  stepper_y.first_active = false;
  stepper_y.toggle = true;
  stepper_y.next_step_time = 0;
  stepper_y.free_rotate = false;
  stepper_y.axis = 'y';
  stepper_y.step_sleep_milli = STEP_SLEEP_MILLI;
  stepper_y.full_rev_mm = FULL_REV_MM_X_Y;
  stepper_y.microstepping = 400;
  setup_stepper(stepper_y);

  stepper_z.stp = STEPPER_Z_STP;
  stepper_z.dir = STEPPER_Z_DIR;
  stepper_z.pow = STEPPER_Z_POW;
  stepper_z.limit_start = STEPPER_Z_LIMIT_START;
  stepper_z.limit_end = STEPPER_Z_LIMIT_END;
  stepper_z.linear_mov = 0.055; // 44/800 = 0.055
  stepper_z.keep_engaged = true;
  stepper_z.pending_steps = 0;
  stepper_z.active = false;
  stepper_z.first_active = false;
  stepper_z.toggle = true;
  stepper_z.next_step_time = 0;
  stepper_z.free_rotate = false;
  stepper_z.axis = 'z';
  stepper_z.step_sleep_milli = STEP_SLEEP_MILLI;
  stepper_z.full_rev_mm = FULL_REV_MM_Z;
  stepper_z.microstepping = 400;
  setup_stepper(stepper_z);

  stepper_syringe.stp = STEPPER_SYRINGE_STP;
  stepper_syringe.dir = STEPPER_SYRINGE_DIR;
  stepper_syringe.pow = STEPPER_SYRINGE_POW;
  stepper_syringe.limit_start = STEPPER_SYRINGE_LIMIT_START;
  stepper_syringe.limit_end = STEPPER_SYRINGE_LIMIT_END;
  stepper_syringe.linear_mov = 0.00125; // 1/800 = 0.11
  stepper_syringe.keep_engaged = true;
  stepper_syringe.pending_steps = 0;
  stepper_syringe.active = false;
  stepper_syringe.first_active = false;
  stepper_syringe.toggle = true;
  stepper_syringe.next_step_time = 0;
  stepper_syringe.free_rotate = false;
  stepper_syringe.step_sleep_milli = STEP_SLEEP_MILLI_SYRINGE;
  stepper_syringe.full_rev_mm = SYRINGE_FULL_REV_MM;
  stepper_syringe.microstepping = 200;
  setup_stepper(stepper_syringe);

  // config pressure regulator input
  pinMode(PRESSURE_REGULATOR_IN, INPUT);

  // config pressure regulator output
  pinMode(PRESSURE_REGULATOR_OUT, OUTPUT);
  analogWrite(PRESSURE_REGULATOR_OUT, 0);

  // config solenoid valve syringe 1
  pinMode(SOLENOID_VALVE_SYRINGE_1, OUTPUT);
  digitalWrite(SOLENOID_VALVE_SYRINGE_1, LOW);

  // config solenoid valve syringe 2
  pinMode(SOLENOID_VALVE_SYRINGE_2, OUTPUT);
  digitalWrite(SOLENOID_VALVE_SYRINGE_2, LOW);

  // working spaces
  wspace_x.axis = 'x';
  wspace_y.axis = 'y';
  wspace_z.axis = 'z';

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

void rotate_concurrent_mm(stepper &stepper, double mm)
{
  const int steps = (int)round(mm / (stepper.full_rev_mm / (float)(stepper.microstepping * 2))); // stepper.linear_mov z -> 44/400 = 0.11
  stepper.pending_steps = steps;
  stepper.free_rotate = false;
  stepper.first_active = true;
  stepper.active = true;
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
  Serial.println("arg index " + String(argIndex) + " : " + arg);
  return arg.toInt();
}

int stepper_concurrent_zeroing_start()
{
  digitalWrite(stepper_x.pow, LOW);
  digitalWrite(stepper_y.pow, LOW);
  digitalWrite(stepper_z.pow, LOW);
  digitalWrite(stepper_x.dir, LOW);
  digitalWrite(stepper_y.dir, LOW);
  digitalWrite(stepper_z.dir, LOW);

  stepper_x.active = true;
  stepper_x.free_rotate = true;
  stepper_y.active = true;
  stepper_y.free_rotate = true;
  stepper_z.active = true;
  stepper_z.free_rotate = true;
}

int stepper_concurrent_zeroing_end()
{
  digitalWrite(stepper_x.pow, LOW);
  digitalWrite(stepper_y.pow, LOW);
  digitalWrite(stepper_z.pow, LOW);
  digitalWrite(stepper_x.dir, HIGH);
  digitalWrite(stepper_y.dir, HIGH);
  digitalWrite(stepper_z.dir, HIGH);

  stepper_x.active = true;
  stepper_x.free_rotate = true;
  stepper_y.active = true;
  stepper_y.free_rotate = true;
  stepper_z.active = true;
  stepper_z.free_rotate = true;
}

void check_direction(stepper &stepper)
{
  if (stepper.first_active)
  {
    digitalWrite(stepper.pow, LOW);

    if (stepper.pending_steps >= 0)
    {
      digitalWrite(stepper.dir, HIGH);
    }
    else
    {
      digitalWrite(stepper.dir, LOW);
    }

    stepper.first_active = false;
  }
}

void check_directions()
{
  check_direction(stepper_x);
  check_direction(stepper_y);
  check_direction(stepper_z);
}

void rotate_concurrent_steps(stepper &stepper)
{
  if (!stepper.free_rotate && stepper.active && (stepper.next_step_time < millis()))
  {
    stepper.next_step_time = millis() + stepper.step_sleep_milli;

    digitalWrite(stepper.stp, stepper.toggle ? HIGH : LOW);

    stepper.toggle = !stepper.toggle;

    stepper.pending_steps += (stepper.pending_steps > 0) ? -1 : 1;

    if (stepper.pending_steps == 0)
    {
      stepper.active = false;
      if (!stepper.keep_engaged)
      {
        digitalWrite(stepper.pow, HIGH);
      }
    }
  }
}

void rotate(stepper &stepper)
{
  if (stepper.free_rotate && stepper.active && (stepper.next_step_time < millis()))
  {
    stepper.next_step_time = millis() + stepper.step_sleep_milli;
    digitalWrite(stepper.stp, stepper.toggle ? HIGH : LOW);
    count_steps(stepper);
    stepper.toggle = !stepper.toggle;
  }
}

void count_steps(stepper &stepper)
{
  if (active_sequence.startsWith("wspace_"))
  {
    sequence *wspace_ptr = stepper.axis == 'x' ? &wspace_x : stepper.axis == 'y' ? &wspace_y
                                                                                 : &wspace_z;

    if (wspace_ptr->current_move == 3)
    {
      wspace_ptr->steps++;
    }
  }
}

void rotate_steps(stepper &stepper, int steps)
{
  stepper.active = true;
  stepper.first_active = true;
  stepper.pending_steps = steps;
}

void stop_stepper(stepper &stepper)
{
  stepper.active = false;
  stepper.free_rotate = false;
  stepper.pending_steps = 0;
  digitalWrite(stepper.pow, LOW);
}

void rotate_steppers()
{
  rotate(stepper_x);
  rotate(stepper_y);
  rotate(stepper_z);
  rotate(stepper_syringe);
  rotate_concurrent_steps(stepper_x);
  rotate_concurrent_steps(stepper_y);
  rotate_concurrent_steps(stepper_z);
}

void check_limits()
{
  check_limit(stepper_x);
  check_limit(stepper_y);
  check_limit(stepper_z);
  check_limit(stepper_syringe);
}

void check_limit(stepper &stepper)
{
  int limit_start = digitalRead(stepper.limit_start);
  int limit_end = digitalRead(stepper.limit_end);
  int stepper_dir = digitalRead(stepper.dir);

  if (stepper.active && !limit_start && !stepper_dir)
  {
    stepper.pending_steps = 0;
    stepper.active = false;
    stepper.first_active = false;
    stepper.free_rotate = false;
    if (!stepper.keep_engaged)
    {
      digitalWrite(stepper.pow, HIGH);
    }
  }

  if (stepper.active && !limit_end && stepper_dir)
  {
    stepper.pending_steps = 0;
    stepper.active = false;
    stepper.first_active = false;
    stepper.free_rotate = false;
    if (!stepper.keep_engaged)
    {
      digitalWrite(stepper.pow, HIGH);
    }
  }
}

void send_pressure_regulator()
{
  // pressure regulator in
  int V2 = analogRead(PRESSURE_REGULATOR_IN);
  Serial.println("pressure_regulator_in:" + String(V2));
}

void set_pressure_regulator(int val)
{
  analogWrite(PRESSURE_REGULATOR_OUT, val);
}

void set_solenoid_valve_syringe_1(int val)
{
  digitalWrite(SOLENOID_VALVE_SYRINGE_1, val ? HIGH : LOW);
}

void send_solenoid_valve_syringe_1()
{
  int solenoid_valve_syringe_1 = digitalRead(SOLENOID_VALVE_SYRINGE_1);
  Serial.println("solenoid_valve_syringe_1:" + String(solenoid_valve_syringe_1));
}

void set_solenoid_valve_syringe_2(int val)
{
  digitalWrite(SOLENOID_VALVE_SYRINGE_2, val ? HIGH : LOW);
}

void send_solenoid_valve_syringe_2()
{
  int solenoid_valve_syringe_2 = digitalRead(SOLENOID_VALVE_SYRINGE_2);
  Serial.println("solenoid_valve_syringe_2:" + String(solenoid_valve_syringe_2));
}

void send_syringe_status()
{
  Serial.println("syringe_status:" + String(stepper_syringe.active));
}

void stop_x_y_z()
{
  stop_stepper(stepper_x);
  stop_stepper(stepper_y);
  stop_stepper(stepper_z);
}

unsigned long last_status_print = 0;

void send_info()
{
  print_elapsed_time(stepper_x);

  // send every second
  if (millis() - last_status_print > 1000)
  {
    last_status_print = millis();
    send_pressure_regulator();
    send_solenoid_valve_syringe_1();
    send_solenoid_valve_syringe_2();
    send_syringe_status();
  }
}

void syringe_start()
{
  digitalWrite(STEPPER_SYRINGE_DIR, LOW);
  stepper_syringe.free_rotate = true;
  stepper_syringe.active = true;
}

void syringe_end()
{
  digitalWrite(STEPPER_SYRINGE_DIR, HIGH);
  stepper_syringe.free_rotate = true;
  stepper_syringe.active = true;
}

void stop_clean_sequence()
{
  clean_sequence.active = false;
  stop_stepper(stepper_syringe);
}

void resume_clean_sequence()
{
  clean_sequence.active = true;
  stepper_syringe.free_rotate = true;
  stepper_syringe.active = true;
}

void set_default_sequence()
{
  active_sequence = "-";
}

// ------ clean sequence ------
void setup_clean_sequence(int number_of_repetitions)
{
  active_sequence = "clean";
  clean_sequence.number_of_repetitions = number_of_repetitions;
  clean_sequence.current_repetition = 0;
  clean_sequence.current_move = 1;
  clean_sequence.active = true;
}

void clean_sequence_check()
{
  if (active_sequence == "clean" && clean_sequence.active)
  {
    if (clean_sequence.current_repetition < clean_sequence.number_of_repetitions)
    {
      if (clean_sequence.current_move == 1)
      {
        digitalWrite(SOLENOID_VALVE_SYRINGE_1, HIGH);
        syringe_end();
        clean_sequence.current_move = 2;
      }
      else if (clean_sequence.current_move == 2 && !stepper_syringe.active)
      {
        digitalWrite(SOLENOID_VALVE_SYRINGE_1, LOW);
        syringe_start();
        clean_sequence.current_move = 3;
      }
      else if (clean_sequence.current_move == 3 && !stepper_syringe.active)
      {
        clean_sequence.current_move = 1;
        clean_sequence.current_repetition++;
      }
    }
    else if (clean_sequence.current_repetition >= clean_sequence.number_of_repetitions)
    {
      clean_sequence.active = false;
      set_default_sequence();
    }
  }
}
// ------ end clean sequence ------

// ------ pattern sequence ------
void setup_pattern_sequence(int number_of_repetitions, int vertical_mov_mm)
{
  active_sequence = "pattern";
  pattern_sequence.number_of_repetitions = number_of_repetitions;
  pattern_sequence.current_repetition = 0;
  pattern_sequence.current_move = 1;
  pattern_sequence.active = true;
  pattern_sequence.total_vertical_mm = 10;
  pattern_sequence.horizontal_mov_mm = 10;
  pattern_sequence.vertical_mov_mm = get_vertical_value_from_arg(vertical_mov_mm);
  pattern_sequence.should_move_horizontal = true;
  pattern_sequence.current_vertical_mm = 0;
}

double get_vertical_value_from_arg(int vertical_mov_mm)
{
  // 0 -> 1, 1 -> 0.5, 2 -> 0.25
  switch (vertical_mov_mm)
  {
  case 0:
    return 1;
  case 1:
    return 0.5;
  case 2:
    return 0.25;
  default:
    return 1;
  }
}

bool xyz_steppers_active()
{
  if (stepper_x.active || stepper_y.active || stepper_z.active)
  {
    return true;
  }
  return false;
}

void pattern_sequence_check()
{
  if (active_sequence == "pattern" && pattern_sequence.active)
  {
    if (pattern_sequence.current_repetition < pattern_sequence.number_of_repetitions)
    {
      if (pattern_sequence.current_move == 1 && !xyz_steppers_active())
      {
        stepper_concurrent_zeroing_start();
        pattern_sequence.current_move = 2;
      }
      else if (pattern_sequence.current_move == 2 && !xyz_steppers_active())
      {
        rotate_concurrent_mm(stepper_x, 100);
        rotate_concurrent_mm(stepper_y, 100);
        pattern_sequence.current_move = 3;
      }
      else if (pattern_sequence.current_move == 3 && !xyz_steppers_active()) // do the pattern
      {
        if (pattern_sequence.should_move_horizontal)
        {
          // move one direction or another, start with positive
          int stepper_x_dir = digitalRead(stepper_x.dir);

          if (stepper_x_dir == LOW || pattern_sequence.current_vertical_mm == 0)
          {
            rotate_concurrent_mm(stepper_x, pattern_sequence.horizontal_mov_mm);
          }
          else
          {
            rotate_concurrent_mm(stepper_x, -pattern_sequence.horizontal_mov_mm);
          }
        }
        else
        {
          rotate_concurrent_mm(stepper_y, pattern_sequence.vertical_mov_mm);
          pattern_sequence.current_vertical_mm += pattern_sequence.vertical_mov_mm;
        }

        if (pattern_sequence.current_vertical_mm <= pattern_sequence.total_vertical_mm)
        {
          pattern_sequence.should_move_horizontal = !pattern_sequence.should_move_horizontal;
        }
        else
        {
          pattern_sequence.current_move = 4;
        }
      }
      else if (pattern_sequence.current_move == 4 && !xyz_steppers_active())
      {
        if (digitalRead(STEPPER_X_DIR) == HIGH) // to check the direction of the stepper // HIGH
        {
          rotate_concurrent_mm(stepper_x, -10);
        }
        rotate_concurrent_mm(stepper_y, -10);
        pattern_sequence.should_move_horizontal = true;
        pattern_sequence.current_vertical_mm = 0;
        pattern_sequence.current_move = 5;
      }
      else if (pattern_sequence.current_move == 5 && !xyz_steppers_active())
      {
        pattern_sequence.should_move_horizontal = true;
        pattern_sequence.current_vertical_mm = 0;
        pattern_sequence.current_repetition++;
        pattern_sequence.current_move = 3;
      }
    }
    else if (pattern_sequence.current_repetition >= pattern_sequence.number_of_repetitions)
    {
      pattern_sequence.active = false;
      set_default_sequence();
    }
  }
}
// ------ end pattern sequence ------

void setup_working_space(sequence &wspace)
{
  active_sequence = "wspace_" + String(wspace.axis);
  wspace.steps = 0;
  wspace.current_move = 1;
  wspace.stepper = wspace.axis == 'x' ? &stepper_x : wspace.axis == 'y' ? &stepper_y
                                                                        : &stepper_z;
  wspace.active = true;
}

void setup_working_spaces()
{
  setup_working_space(wspace_x);
  setup_working_space(wspace_y);
  setup_working_space(wspace_z);
}

void working_space_check(sequence &wspace)
{
  stepper *stepper_ptr = wspace.stepper;
  String sequence_name = "wspace_";

  if (active_sequence.startsWith(sequence_name) && wspace.active)
  {
    if (wspace.current_move == 1)
    {
      wspace.current_move = 2;
      digitalWrite(stepper_ptr->pow, LOW);
      digitalWrite(stepper_ptr->dir, LOW);
      stepper_ptr->active = true;
      stepper_ptr->free_rotate = true;
      // stepper_concurrent_zeroing_start();
    }
    else if (wspace.current_move == 2 && !stepper_ptr->active)
    {
      wspace.current_move = 3;
      digitalWrite(stepper_ptr->dir, HIGH);
      stepper_ptr->active = true;
      stepper_ptr->free_rotate = true;
      // stepper_concurrent_zeroing_end();
    }
    else if (wspace.current_move == 3 && !stepper_ptr->active)
    {
      double mm = (double)(wspace.steps * (stepper_ptr->full_rev_mm / (float)(stepper_ptr->microstepping * 2)));
      Serial.println("wspace_" + String(wspace.axis) + ":" + String(mm));
      wspace.active = false;
      set_default_sequence();
    }
  }
}

void check_sequences()
{
  clean_sequence_check();
  pattern_sequence_check();
  working_space_check(wspace_x);
  working_space_check(wspace_y);
  working_space_check(wspace_z);
  check_standby_motos_sequence();
}

void set_velocity_stepper(stepper &stepper, double vel)
{
  double step_sleep_milli = (stepper.full_rev_mm * stepper.microstepping) / (360.0 * vel);
  stepper.step_sleep_milli = int(round(step_sleep_milli));
  Serial.println("set_velocity_stepper: stepper.step_sleep_milli" + String(stepper.step_sleep_milli));
}

// void set_velocity_stepper(stepper &stepper, int vel)
// {
//   Serial.println("set_velocity_stepper: axis" + String(stepper.axis));
//   double steps_per_rev = (360.0 / stepper.full_rev_mm) * stepper.microstepping;
//   Serial.println("set_velocity_stepper: steps_per_rev" + String(steps_per_rev));
//   double linear_movement_per_step = double(stepper.full_rev_mm) / double(steps_per_rev * (stepper.microstepping));
//   Serial.println("set_velocity_stepper: linear_movement_per_step" + String(linear_movement_per_step));
//   double time_per_step = (linear_movement_per_step * stepper.microstepping) / (vel / 60.0); // convert velocity from mm/s to mm/min
//   Serial.println("set_velocity_stepper: time_per_step" + String(time_per_step));
//   stepper.step_sleep_milli = int(round(time_per_step * 1000.0 * stepper.microstepping)); // multiply by microstepping
// }

// ------ standby sequence ------

void setup_standby_motors_sequence()
{
  active_sequence = "standby_motors";
  standby_motors.active = true;
  standby_motors.current_move = 1;
}

void check_standby_motos_sequence()
{
  if (active_sequence.startsWith("standby_motors") && standby_motors.active)
  {
    if (standby_motors.current_move == 1)
    {
      standby_motors.current_move = 2;
      stepper_concurrent_zeroing_start();
    }
    else if (standby_motors.current_move == 2 && !xyz_steppers_active())
    {
      digitalWrite(stepper_x.pow, HIGH);
      digitalWrite(stepper_y.pow, HIGH);
      digitalWrite(stepper_z.pow, HIGH);
      standby_motors.active = false;
      set_default_sequence();
    }
  }
}

// ------ end standby sequence ------

static unsigned long start_time = 0;

void print_elapsed_time(stepper &stepper)
{
  if (stepper.active && start_time == 0)
  {
    start_time = millis();
  }
  else if (!stepper.active && start_time != 0)
  {
    unsigned long elapsed_time = (millis() - start_time) / 1000;
    Serial.println("time: Stepper was active for " + String(elapsed_time) + " seconds");
    start_time = 0;
  }
}

void read_serial_command()
{
  if (Serial.available() > 0)
  {
    String command = Serial.readStringUntil('\n');

    if (command == "zeroing_start")
    {
      stepper_concurrent_zeroing_start();
    }
    else if (command == "zeroing_end")
    {
      stepper_concurrent_zeroing_end();
    }
    else if (command.startsWith("mm_x"))
    {
      rotate_concurrent_mm(stepper_x, get_command_arg(command, 1));
    }
    else if (command.startsWith("mm_y"))
    {
      rotate_concurrent_mm(stepper_y, get_command_arg(command, 1));
    }
    else if (command.startsWith("mm_z"))
    {
      rotate_concurrent_mm(stepper_z, get_command_arg(command, 1));
    }
    else if (command.startsWith("set_sharpening_pressure"))
    {
      set_pressure_regulator(get_command_arg(command, 1));
    }
    else if (command.startsWith("set_solenoid_valve_syringe_1"))
    {
      set_solenoid_valve_syringe_1(get_command_arg(command, 1));
    }
    else if (command.startsWith("set_solenoid_valve_syringe_2"))
    {
      set_solenoid_valve_syringe_2(get_command_arg(command, 1));
    }
    else if (command.startsWith("syringe_start"))
    {
      syringe_start();
    }
    else if (command.startsWith("syringe_end"))
    {
      syringe_end();
    }
    else if (command.startsWith("stop_syringe"))
    {
      stop_stepper(stepper_syringe);
    }
    else if (command.startsWith("stop_x_y_z"))
    {
      stop_x_y_z();
    }
    else if (command.startsWith("clean"))
    {
      setup_clean_sequence(get_command_arg(command, 1));
    }
    else if (command.startsWith("stop_clean"))
    {
      stop_clean_sequence();
    }
    else if (command.startsWith("resume_clean"))
    {
      resume_clean_sequence();
    }
    else if (command.startsWith("pattern"))
    {
      setup_pattern_sequence(get_command_arg(command, 1), get_command_arg(command, 2));
    }
    else if (command.startsWith("pattern_stop"))
    {
      set_default_sequence();
    }
    else if (command.startsWith("wspace_"))
    {
      setup_working_space(command[7] == 'x' ? wspace_x : command[7] == 'y' ? wspace_y
                                                                           : wspace_z);
    }
    else if (command.startsWith("stepper_velocity_"))
    {
      set_velocity_stepper(command[17] == 'x' ? stepper_x : command[17] == 'y' ? stepper_y
                                                        : command[17] == 'z'   ? stepper_z
                                                                               : stepper_syringe,
                           get_command_arg(command, 1));
    }
    else if (command.startsWith("standby_x_y_z"))
    {
      setup_standby_motors_sequence();
    }
  }
}

void loop()
{
  read_serial_command();

  check_directions();

  check_limits();

  rotate_steppers();

  // print_elapsed_time(stepper_x);

  // send_info();

  check_sequences();

  delay(1);
}

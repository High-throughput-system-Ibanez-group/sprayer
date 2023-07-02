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
#define MICROSTEPPING 400
#define LIN_MOV_X_Y 0.135 // 54/400 = 0.135
#define LIN_MOV_Z 0.11    // 44/400 = 0.11
#define STEP_SLEEP_MICRO 8000
#define STEP_SLEEP_MILLI 8

#define STEPPER_SYRINGE_STP 52
#define STEPPER_SYRINGE_DIR 2
#define STEPPER_SYRINGE_POW 36
#define STEPPER_SYRINGE_LIMIT_START 23
#define STEPPER_SYRINGE_LIMIT_END 22
#define SYRINGE_FULL_REV_MM 1

#define PRESSURE_REGULATOR_OUT 6
#define PRESSURE_REGULATOR_IN 54
#define SOLENOID_VALVE 40

#define PI 3.1416

struct stepper
{
  int stp;
  int dir;
  int pow;
  int limit_start;
  int limit_end;
  int pending_steps;
  bool keep_engaged;
  bool active;
  bool first_active;
  bool toggle;
  unsigned long next_step_time;
};

stepper stepper_x;
stepper stepper_y;
stepper stepper_z;

void setup()
{
  stepper_x.stp = STEPPER_X_STP;
  stepper_x.dir = STEPPER_X_DIR;
  stepper_x.pow = STEPPER_X_POW;
  stepper_x.limit_start = STEPPER_X_LIMIT_START;
  stepper_x.limit_end = STEPPER_X_LIMIT_END;
  stepper_x.pending_steps = 0;
  stepper_x.active = false;
  stepper_x.first_active = false;
  stepper_x.toggle = true;
  stepper_x.next_step_time = 0;
  stepper_x.keep_engaged = false;
  setup_stepper(stepper_x);

  stepper_y.stp = STEPPER_Y_STP;
  stepper_y.dir = STEPPER_Y_DIR;
  stepper_y.pow = STEPPER_Y_POW;
  stepper_y.limit_start = STEPPER_Y_LIMIT_START;
  stepper_y.limit_end = STEPPER_Y_LIMIT_END;
  stepper_y.pending_steps = 0;
  stepper_y.active = false;
  stepper_y.first_active = false;
  stepper_y.toggle = true;
  stepper_y.next_step_time = 0;
  stepper_y.keep_engaged = false;
  setup_stepper(stepper_y);

  stepper_z.stp = STEPPER_Z_STP;
  stepper_z.dir = STEPPER_Z_DIR;
  stepper_z.pow = STEPPER_Z_POW;
  stepper_z.limit_start = STEPPER_Z_LIMIT_START;
  stepper_z.limit_end = STEPPER_Z_LIMIT_END;
  stepper_z.pending_steps = 0;
  stepper_z.active = false;
  stepper_z.first_active = false;
  stepper_z.toggle = true;
  stepper_z.next_step_time = 0;
  stepper_z.keep_engaged = true;
  setup_stepper(stepper_z);

  Serial.begin(9600);
}

void setup_stepper(stepper stepper)
{
  pinMode(stepper.stp, OUTPUT);
  digitalWrite(stepper.stp, LOW);

  pinMode(stepper.dir, OUTPUT);
  digitalWrite(stepper.dir, LOW);

  pinMode(stepper.pow, OUTPUT);
  digitalWrite(stepper.pow, HIGH);

  pinMode(stepper.limit_start, INPUT);
  pinMode(stepper.limit_end, INPUT);
}

void rotate_steps(stepper stepper, int steps)
{
  if (steps >= 0)
  {
    digitalWrite(stepper.dir, HIGH);
  }
  else
  {
    digitalWrite(stepper.dir, LOW);
  }

  digitalWrite(stepper.pow, LOW);

  for (int i = 0; i < abs(steps); i++)
  {
    digitalWrite(stepper.stp, HIGH);
    delayMicroseconds(STEP_SLEEP_MICRO);
    digitalWrite(stepper.stp, LOW);
    delayMicroseconds(STEP_SLEEP_MICRO);
  }

  if (!stepper.keep_engaged)
  {
    digitalWrite(stepper.pow, HIGH);
  }
}

void rotate_mm(stepper stepper, int mm, int axis) // axis = 0 -> x or y, axis = 1 -> z
{
  const int steps = (int)round(mm / (axis ? LIN_MOV_Z : LIN_MOV_X_Y));
  rotate_steps(stepper, steps);
}

void rotate_concurrent_mm(stepper &stepper, int mm, int axis) // axis = 0 -> x or y, axis = 1 -> z
{
  const int steps = (int)round(mm / (axis ? LIN_MOV_Z : LIN_MOV_X_Y));
  stepper.pending_steps = steps;
  stepper.active = true;
  stepper.first_active = true;
}

int rotate_until_end(stepper stepper)
{
  int steps = 0;

  digitalWrite(stepper.dir, HIGH);
  digitalWrite(stepper.pow, LOW);

  while (digitalRead(stepper.limit_end))
  {
    digitalWrite(stepper.stp, HIGH);
    delayMicroseconds(STEP_SLEEP_MICRO);
    digitalWrite(stepper.stp, LOW);
    delayMicroseconds(STEP_SLEEP_MICRO);
    steps += 1;
  }

  digitalWrite(stepper.pow, HIGH);

  return steps;
}

int get_command_arg(String command)
{
  int separator_index = command.indexOf(":");
  String arg = command.substring(separator_index + 1);
  return arg.toInt();
}

int stepper_zeroing()
{
  digitalWrite(stepper_x.dir, LOW);
  digitalWrite(stepper_y.dir, LOW);
  digitalWrite(stepper_z.dir, LOW);

  int limit_x = digitalRead(stepper_x.limit_start);
  int limit_y = digitalRead(stepper_y.limit_start);
  int limit_z = digitalRead(stepper_z.limit_start);

  if (limit_x)
    digitalWrite(stepper_x.pow, LOW);
  if (limit_y)
    digitalWrite(stepper_y.pow, LOW);
  if (limit_z)
    digitalWrite(stepper_z.pow, LOW);

  while (limit_x || limit_y || limit_z)
  {
    if (limit_x)
      digitalWrite(stepper_x.stp, HIGH);
    if (limit_y)
      digitalWrite(stepper_y.stp, HIGH);
    if (limit_z)
      digitalWrite(stepper_z.stp, HIGH);

    delayMicroseconds(STEP_SLEEP_MICRO);

    if (limit_x)
      digitalWrite(stepper_x.stp, LOW);
    if (limit_y)
      digitalWrite(stepper_y.stp, LOW);
    if (limit_z)
      digitalWrite(stepper_z.stp, LOW);

    delayMicroseconds(STEP_SLEEP_MICRO);

    limit_x = digitalRead(stepper_x.limit_start);
    limit_y = digitalRead(stepper_y.limit_start);
    limit_z = digitalRead(stepper_z.limit_start);
  }

  digitalWrite(stepper_x.pow, HIGH);
  digitalWrite(stepper_y.pow, HIGH);
  digitalWrite(stepper_z.pow, HIGH);
}

int stepper_zeroing_end()
{
  digitalWrite(stepper_x.dir, HIGH);
  digitalWrite(stepper_y.dir, HIGH);
  digitalWrite(stepper_z.dir, HIGH);

  int limit_x = digitalRead(stepper_x.limit_end);
  int limit_y = digitalRead(stepper_y.limit_end);
  int limit_z = digitalRead(stepper_z.limit_end);

  if (limit_x)
    digitalWrite(stepper_x.pow, LOW);
  if (limit_y)
    digitalWrite(stepper_y.pow, LOW);
  if (limit_z)
    digitalWrite(stepper_z.pow, LOW);

  while (limit_x || limit_y || limit_z)
  {
    if (limit_x)
      digitalWrite(stepper_x.stp, HIGH);
    if (limit_y)
      digitalWrite(stepper_y.stp, HIGH);
    if (limit_z)
      digitalWrite(stepper_z.stp, HIGH);

    delayMicroseconds(STEP_SLEEP_MICRO);

    if (limit_x)
      digitalWrite(stepper_x.stp, LOW);
    if (limit_y)
      digitalWrite(stepper_y.stp, LOW);
    if (limit_z)
      digitalWrite(stepper_z.stp, LOW);

    delayMicroseconds(STEP_SLEEP_MICRO);

    limit_x = digitalRead(stepper_x.limit_end);
    limit_y = digitalRead(stepper_y.limit_end);
    limit_z = digitalRead(stepper_z.limit_end);
  }

  digitalWrite(stepper_x.pow, HIGH);
  digitalWrite(stepper_y.pow, HIGH);
  digitalWrite(stepper_z.pow, HIGH);
}

void check_direction(stepper &stepper)
{
  if (stepper.first_active)
  {
    if (stepper.pending_steps >= 0)
    {
      digitalWrite(stepper.dir, HIGH);
    }
    else
    {
      digitalWrite(stepper.dir, LOW);
    }

    digitalWrite(stepper.pow, LOW);

    stepper.first_active = false;
  }
}

void read_serial_command()
{
  if (Serial.available() > 0)
  {
    String command = Serial.readStringUntil('\n');

    if (command == "test")
    {
      int data = rotate_until_end(stepper_x);
      char cstr[16];
      itoa(data, cstr, 10);
      Serial.println(cstr);
    }
    else if (command == "zeroing_start")
    {
      stepper_zeroing();
    }
    else if (command == "zeroing_end")
    {
      stepper_zeroing_end();
    }
    else if (command.startsWith("stepper_x"))
    {
      // rotate_steps(stepper_x, 200, false);
      stepper_x.active = true;
      stepper_x.first_active = true;
      stepper_x.pending_steps = 200;
    }
    else if (command.startsWith("stepper_y"))
    {
      rotate_steps(stepper_y, 200);
    }
    else if (command.startsWith("stepper_z"))
    {
      rotate_steps(stepper_z, 200);
    }
    else if (command.startsWith("mm_x"))
    {
      // rotate_mm(stepper_x, get_command_arg(command), false, 0);
      rotate_concurrent_mm(stepper_x, get_command_arg(command), 0);
    }
    else if (command.startsWith("mm_y"))
    {
      rotate_mm(stepper_y, get_command_arg(command), 0);
    }
    else if (command.startsWith("mm_z"))
    {
      rotate_mm(stepper_z, get_command_arg(command), 1);
    }
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
  if (stepper.active && (stepper.next_step_time < millis()))
  {
    stepper.next_step_time = millis() + STEP_SLEEP_MILLI;

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

void rotate_steppers()
{
  rotate_concurrent_steps(stepper_x);
  rotate_concurrent_steps(stepper_y);
  rotate_concurrent_steps(stepper_z);
}

void loop()
{
  read_serial_command();

  check_directions();

  rotate_steppers();

  delay(1);
}

#define STEPPER_X_STP 2
#define STEPPER_X_DIR 3
#define STEPPER_X_POW 4
#define STEPPER_X_LIMIT_START 5
#define STEPPER_X_LIMIT_END 39

#define STEPPER_Y_STP 6
#define STEPPER_Y_DIR 7
#define STEPPER_Y_POW 8
#define STEPPER_Y_LIMIT_START 9
#define STEPPER_Y_LIMIT_END 41

#define STEPPER_Z_STP 10
#define STEPPER_Z_DIR 11
#define STEPPER_Z_POW 12
#define STEPPER_Z_LIMIT_START 13
#define STEPPER_Z_LIMIT_END 43

#define FULL_REV_MM_X_Y 54
#define FULL_REV_MM_Z 44
#define MICROSTEPPING 400
#define STEP_SLEEP 8000

#define STEPPER_SYRINGE_STP 22
#define STEPPER_SYRINGE_DIR 23
#define STEPPER_SYRINGE_POW 24
#define STEPPER_SYRINGE_LIMIT_START 25
#define STEPPER_SYRINGE_LIMIT_END 45
#define SYRINGE_FULL_REV_MM 1

#define PI 3.1416

struct stepper
{
  int stp;
  int dir;
  int pow;
  int limit_start;
  int limit_end;
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

void rotate_steps(stepper stepper, int steps, bool keep_engaged)
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

  // int i = 0;

  // while (i < abs(steps))
  // {

  //   i++;
  // }

  for (int i = 0; i < abs(steps); i++)
  {
    digitalWrite(stepper.stp, HIGH);
    delayMicroseconds(STEP_SLEEP);
    digitalWrite(stepper.stp, LOW);
    delayMicroseconds(STEP_SLEEP);
  }

  if (!keep_engaged)
  {
    digitalWrite(stepper.pow, HIGH);
  }
}

void rotate_mm(stepper stepper, int mm, bool keep_engaged)
{
  int steps = (int)round(mm / 0.135); // 27 / 0.135 => 200
  rotate_steps(stepper, steps, keep_engaged);
}

int rotate_until_end(stepper stepper)
{
  int steps = 0;

  digitalWrite(stepper.dir, HIGH);
  digitalWrite(stepper.pow, LOW);

  while (digitalRead(stepper.limit_end))
  {
    digitalWrite(stepper.stp, HIGH);
    delayMicroseconds(STEP_SLEEP);
    digitalWrite(stepper.stp, LOW);
    delayMicroseconds(STEP_SLEEP);
    steps += 1;
  }

  digitalWrite(stepper.pow, HIGH);

  return steps;
}

int get_command_arg(String command)
{
  int separator_index = command.indexOf(":");
  String arg = command.substring(separator_index + 1);
  arg.toInt();
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

    delayMicroseconds(STEP_SLEEP);

    if (limit_x)
      digitalWrite(stepper_x.stp, LOW);
    if (limit_y)
      digitalWrite(stepper_y.stp, LOW);
    if (limit_z)
      digitalWrite(stepper_z.stp, LOW);

    delayMicroseconds(STEP_SLEEP);

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

    delayMicroseconds(STEP_SLEEP);

    if (limit_x)
      digitalWrite(stepper_x.stp, LOW);
    if (limit_y)
      digitalWrite(stepper_y.stp, LOW);
    if (limit_z)
      digitalWrite(stepper_z.stp, LOW);

    delayMicroseconds(STEP_SLEEP);

    limit_x = digitalRead(stepper_x.limit_end);
    limit_y = digitalRead(stepper_y.limit_end);
    limit_z = digitalRead(stepper_z.limit_end);
  }

  digitalWrite(stepper_x.pow, HIGH);
  digitalWrite(stepper_y.pow, HIGH);
  digitalWrite(stepper_z.pow, HIGH);
}

void loop()
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
      rotate_steps(stepper_x, 200, false);
    }
    else if (command.startsWith("stepper_y"))
    {
      rotate_steps(stepper_y, 200, false);
    }
    else if (command.startsWith("stepper_z"))
    {
      rotate_steps(stepper_z, 200, true);
    }
  }

  delay(1);
}

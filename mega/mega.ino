#define STEPPER_X_STP 2
#define STEPPER_X_DIR 3
#define STEPPER_X_POW 4
#define STEPPER_X_END 5

#define STEPPER_Y_STP 6
#define STEPPER_Y_DIR 7
#define STEPPER_Y_POW 8
#define STEPPER_Y_END 9

#define STEPPER_Z_STP 10
#define STEPPER_Z_DIR 11
#define STEPPER_Z_POW 12
#define STEPPER_Z_END 13

struct stepper
{
  int stp;
  int dir;
  int pow;
  int end;
};

stepper stepper_x;
stepper stepper_y;
stepper stepper_z;

void setup()
{
  stepper_x.stp = STEPPER_X_STP;
  stepper_x.dir = STEPPER_X_DIR;
  stepper_x.pow = STEPPER_X_POW;
  stepper_x.end = STEPPER_X_END;
  setup_stepper(stepper_x);

  stepper_y.stp = STEPPER_Y_STP;
  stepper_y.dir = STEPPER_Y_DIR;
  stepper_y.pow = STEPPER_Y_POW;
  stepper_y.end = STEPPER_Y_END;
  setup_stepper(stepper_y);

  stepper_z.stp = STEPPER_Z_STP;
  stepper_z.dir = STEPPER_Z_DIR;
  stepper_z.pow = STEPPER_Z_POW;
  stepper_z.end = STEPPER_Z_END;
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

  pinMode(stepper.end, INPUT);
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
    delayMicroseconds(4000);
    digitalWrite(stepper.stp, LOW);
    delayMicroseconds(4000);
  }

  digitalWrite(stepper.pow, HIGH);
}

int get_command_int_arg(String command)
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

  int endpoint_x = digitalRead(stepper_x.end);
  int endpoint_y = digitalRead(stepper_y.end);
  int endpoint_z = digitalRead(stepper_z.end);

  if (endpoint_x)
    digitalWrite(stepper_x.pow, LOW);
  if (endpoint_y)
    digitalWrite(stepper_y.pow, LOW);
  if (endpoint_z)
    digitalWrite(stepper_z.pow, LOW);

  while (endpoint_x || endpoint_y || endpoint_z)
  {
    if (endpoint_x)
      digitalWrite(stepper_x.stp, HIGH);
    if (endpoint_y)
      digitalWrite(stepper_y.stp, HIGH);
    if (endpoint_z)
      digitalWrite(stepper_z.stp, HIGH);

    delayMicroseconds(4000);

    if (endpoint_x)
      digitalWrite(stepper_x.stp, LOW);
    if (endpoint_y)
      digitalWrite(stepper_y.stp, LOW);
    if (endpoint_z)
      digitalWrite(stepper_z.stp, LOW);

    delayMicroseconds(4000);

    endpoint_x = digitalRead(stepper_x.end);
    endpoint_y = digitalRead(stepper_y.end);
    endpoint_z = digitalRead(stepper_z.end);
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

    if (command == "test:x")
    {
      rotate_steps(stepper_x, 100);
    }
    else if (command == "test:y")
    {
      rotate_steps(stepper_y, 100);
    }
    else if (command == "test:z")
    {
      rotate_steps(stepper_z, 100);
    }
    else if (command == "zeroing")
    {
      stepper_zeroing();
    }
  }

  delay(1);
}

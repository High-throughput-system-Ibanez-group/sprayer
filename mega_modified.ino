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

#define STEPPER_TESTING_STP 3
#define STEPPER_TESTING_DIR 2
#define STEPPER_TESTING_POW 4
#define STEPPER_TESTING_LIMIT_START 13
#define STEPPER_TESTING_LIMIT_END 43

#define FULL_REV_MM_TESTING 1
#define LIN_MOV_TESTING 0.005

#define FULL_REV_MM_X_Y 54
#define FULL_REV_MM_Z 44
#define MICROSTEPPING 400
#define LIN_MOV_X_Y 0.135 // 54/400 = 0.135
#define LIN_MOV_Z 0.11    // 44/400 = 0.11
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
stepper stepper_testing;

void setup()
{
  // stepper_x.stp = STEPPER_X_STP;
  // stepper_x.dir = STEPPER_X_DIR;
  // stepper_x.pow = STEPPER_X_POW;
  // stepper_x.limit_start = STEPPER_X_LIMIT_START;
  // stepper_x.limit_end = STEPPER_X_LIMIT_END;
  // setup_stepper(stepper_x);

  // stepper_y.stp = STEPPER_Y_STP;
  // stepper_y.dir = STEPPER_Y_DIR;
  // stepper_y.pow = STEPPER_Y_POW;
  // stepper_y.limit_start = STEPPER_Y_LIMIT_START;
  // stepper_y.limit_end = STEPPER_Y_LIMIT_END;
  // setup_stepper(stepper_y);

  // stepper_z.stp = STEPPER_Z_STP;
  // stepper_z.dir = STEPPER_Z_DIR;
  // stepper_z.pow = STEPPER_Z_POW;
  // stepper_z.limit_start = STEPPER_Z_LIMIT_START;
  // stepper_z.limit_end = STEPPER_Z_LIMIT_END;
  // setup_stepper(stepper_z);

  stepper_testing.stp = STEPPER_TESTING_STP;
  stepper_testing.dir = STEPPER_TESTING_DIR;
  stepper_testing.pow = STEPPER_TESTING_POW;
  setup_stepper(stepper_testing);

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

void stepper_power(stepper stepper, bool power)
{
  digitalWrite(stepper.pow, power ? LOW : HIGH);
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

  stepper_power(stepper_testing, true);

  for (int i = 0; i < abs(steps); i++)
  {
    digitalWrite(stepper.stp, HIGH);
    delayMicroseconds(STEP_SLEEP);
    digitalWrite(stepper.stp, LOW);
    delayMicroseconds(STEP_SLEEP);
  }

  if (!keep_engaged)
  {
    stepper_power(stepper_testing, false);
  }
}

void rotate_mm(stepper stepper, int mm, bool keep_engaged, int axis) // axis = 0 -> x or y, axis = 1 -> z
{
  const int steps = (int)round(mm / LIN_MOV_TESTING);
  // const int steps = (int)round(mm / (axis ? LIN_MOV_Z : LIN_MOV_X_Y));
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

void send_power_status(stepper stepper)
{
  Serial.println("power:" + String(digitalRead(stepper.pow) ? "1" : "0"));
}

unsigned long previousTimeSendPower = millis();
long timeIntervalSendPower = 500;

unsigned long previousTimeDisable = millis();
long timeIntervalDisable = 100;
// unsigned long last_serial_read_time = 0;
// unsigned long last_power_sent_time = 0;

void loop()
{
  unsigned long currentTime = millis();
  // Read from serial port every 100 milliseconds
  if (currentTime - previousTimeDisable > timeIntervalDisable)
  {
    previousTimeDisable = currentTime;
    if (Serial.available() > 0)
    {
      String command = Serial.readStringUntil('\n');
      if (command == "disable")
      {
        Serial.println("command:Executting disable ...");
        stepper_power(stepper_testing, false);
        Serial.println("command:End disable");
      }
    }
  }
  if (currentTime - previousTimeSendPower > timeIntervalSendPower)
  {
    {
      previousTimeSendPower = currentTime;
      Serial.println("command:Executting send_power ...");
      send_power_status(stepper_testing);
      Serial.println("command:End send_power");
    }
  }
  if (Serial.available() > 0)
  {
    String command = Serial.readStringUntil('\n');
    Serial.println("command:Executting " + command + " ...");
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
    else if (command.startsWith("mm_x"))
    {
      // rotate_steps(stepper_testing, 100, false);
      rotate_mm(stepper_testing, get_command_arg(command), false, 0);
    }
    else if (command.startsWith("mm_y"))
    {
      rotate_mm(stepper_y, get_command_arg(command), false, 0);
    }
    else if (command.startsWith("mm_z"))
    {
      rotate_mm(stepper_z, get_command_arg(command), false, 1);
    }
    else if (command == "enable")
    {
      Serial.println("enable");
      stepper_power(stepper_testing, true);
    }
    // else if (command == "disable")
    // {
    //   Serial.println("disable");
    //   stepper_power(stepper_testing, false);
    // }
    Serial.println("command:End " + command);
  }
  send_power_status(stepper_testing);
  delay(1);
}

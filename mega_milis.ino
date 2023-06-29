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

#define STEPPER_TESTING_STP 3
#define STEPPER_TESTING_DIR 2
#define STEPPER_TESTING_POW 4
#define FULL_REV_MM_TESTING 1
#define LIN_MOV_TESTING 0.005
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

  unsigned long last_step_time = 0;
  const unsigned long step_interval = 1000 / STEP_SLEEP; // Time between steps in milliseconds STEP_SLEEP=8000

  for (int i = 0; i < abs(steps); i++)
  {
    // Check if it's time to take a step
    if (millis() - last_step_time >= step_interval)
    {
      digitalWrite(stepper.stp, HIGH);
      digitalWrite(stepper.stp, LOW);
      last_step_time = millis();
    }
  }

  if (!keep_engaged)
  {
    digitalWrite(stepper.pow, HIGH);
  }
}

unsigned long last_test_time = 0;
const unsigned long test_interval = 10000;
boolean rotating = false;

void rotate_mm(stepper stepper, int mm, bool keep_engaged, int axis) // axis = 0 -> x or y, axis = 1 -> z
{
  // simulate the rotation for 10s
  rotating = true;
  if (millis() - last_test_time >= test_interval)
  {
    Serial.println("command:Executing rotate_mm ...");
    rotating = !rotating;
    last_test_time = millis();
  }
  // const int steps = (int)round(mm / LIN_MOV_TESTING);
  // // const int steps = (int)round(mm / (axis ? LIN_MOV_Z : LIN_MOV_X_Y));
  // rotate_steps(stepper, steps, keep_engaged);
  // Serial.println("command:End rotate_mm");
}

int get_command_arg(String command)
{
  int separator_index = command.indexOf(":");
  String arg = command.substring(separator_index + 1);
  return arg.toInt();
}

void stepper_power(stepper stepper, bool power)
{
  digitalWrite(stepper.pow, power ? LOW : HIGH);
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

// Define the possible states of the program
enum State
{
  IDLE,
  ROTATING,
};

// Initialize the state to IDLE
State state = IDLE;

// Command string
String command = "";

unsigned long last_send_time = 0;
const unsigned long send_interval = 1000; // Send power status every 1000 milliseconds (1 second)
const unsigned long test_interval = 10000;

void loop()
{
  // Check if there is data available on the Serial port
  if (Serial.available() > 0)
  {
    // Read the command from the Serial port
    command = Serial.readStringUntil('\n');

    // Check if the command requires a blocking task
    if (command.startsWith("mm_x"))
    {
      // Set the state to ROTATING
      state = ROTATING;
    }
  }

  // Perform actions based on the current state
  switch (state)
  {
  case ROTATING:
    // Call the rotate_mm() function with the appropriate arguments
    rotate_mm(stepper_testing, get_command_arg(command), false, 0);
    // Set the state back to IDLE
    break;
  }

  if (millis() - last_send_time >= send_interval)
  {
    send_power_status(stepper_testing);
    last_send_time = millis();
  }

  // Add a delay to prevent the program from running too quickly
  delay(1);
}

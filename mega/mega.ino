// C++ code
//
/*
  This program blinks pin 13 of the Arduino (the
  built-in LED)
*/

void setup()
{
    Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop()
{
    if (Serial.available() > 0)
	{
    
    String command = Serial.readStringUntil('\n');
        
        if (command == "open")
		{
			// turn the LED on (HIGH is the voltage level)
            digitalWrite(LED_BUILTIN, HIGH);
		}
        else if (command == "close")
		{
			digitalWrite(LED_BUILTIN, LOW);
		}
    }
}
# SPARTA TELECOM — AI VOICE SALES & SERVICE REPRESENTATIVE COPILOT

SPARTA is a real-time call copilot and interactive agent tool built for **Sparta Telecom** sales and service representatives calling UK landline holders regarding the nationwide copper-to-digital network transition and bill reductions.

---

## Telecom Script (Verbatim)

### Opening 1 (Afternoon Feedback / 30% Reduction)
```text
Me : Hello.... yeah hiii, Am i speaking to Mr xxxxxx, 
Cx : yeah Me : Hello Mr Campbell, a lovely afternoon to you, this side _______ Calling regarding your landline that is currently active at your property.
Just wanted to see your feedback on the services,if there is a scope for improvement?
Or
Just wanted to update, that your phone line is eligible for a reduction up to 30% this year.
Ok ? Take the response !!!
```

### Opening 2 (Morning Digital Transition)
```text
Hi, very good morning to you. Am I speaking with Mr. Customer?
My name is ______i m calling u in regards to your home phone no. I’m sure you are already aware that in the coming future everything is going to be digital because the normal copper line is converting into digital one. Hence there is an opportunity for bill reduction this year.
```
                            ↓

### Probability Discovery & Qualification
```text
To make sure I look at the right options for you, May I know if  you are  using your home phone quite a lot for making calls, or is it mostly just there for incoming calls?"

 (Wait for customer response. Listen to see if they follow the question easily.)
"And do you also have your internet or broadband running on this exact same line?"
 (Wait for customer response.)
Perfect, thank you. To ensure our digital packages make sense for you financially, could you give me a rough idea of what you currently pay each month for your phone bill? Is it around £40 , £50 or over £60 a month , or perhaps a bit more or less than that?"

 (Wait for customer response. If they are highly confused about what they pay or who their provider is, take note.)
```

### Digital Service Transition & 24-Month Savings Pitch
```text
Based on what you've told me, we can transition you over to a digital service with Sparta Telecom. This will keep your exact same phone number and line completely unchanged, but it will bring your bill down to just £[Insert monthly price].
This means you will save £[Insert monthly savings] every single month. Over the course of the 24-month agreement, that adds up to a total saving of £[Insert total 2-year savings] back in your pocket.
Hope it sounds good to you?
(Wait for customer response.
 All of these savings are coming to you on the same line on your same number without changing anything from  Sparta telecom for an effective 24 months, that means you will be saving every month £___   if i talk about in 2 years you will be saving £_____.
```

### Details & Primary Account Holder Verification
```text
So in order to provide you to these savings and digital services i have your number with me 123455466 Your name with me Mr /Mrs/Miss/Ms_____
 Your address _______
Your dob__________
Thank you. And just to confirm our regulatory guidelines, are you the primary account holder and the person who handles the utility decisions for this household?"
 
 (Wait for customer response.)
```

### Payment Method & Social Alarm / Pendant Check
```text
As you pay your bills by direct debit at the moment so your mode of payment will remain the same as it is with Sparta telecom.
"Perfect. Since you currently pay your bills via Direct Debit, that secure payment method will stay exactly the same with us at Sparta Telecom. There's nothing new you need to set up there.
Now, your safety is very important to us, especially with the digital switchover. Do you currently use any type of social alarm, pendant, or personal safety button connected to your phone line?"
[If NO]: "Excellent, we can move right along."
[If YES & Line is Copper]: "Perfect, we can proceed. Just to let you know, our team will ensure this transitions smoothly."
[If YES & Line is Digital]: "Ah, I see. Could you let me know if that alarm plugs directly into your internet router, or does it plug into a standard electrical wall socket?" (Must be electricity to
```

### Calling Features & Paper Itemized Bill
```text
You use any calling features like 1471/1571 1571 voice mail calling feature is free for you .
We will send u a paper itemized bill which is free for u for the first 2 months afterwards if u wish to continue it will only cost 1 pound on top of your package and you can deactivate the paper bill any time you want.
```

### Sparta Telecom Platform & Independent Company
```text
So all these savings and digital services are coming to you with the help of Sparta Telecom and we are working on the same platform as BT works. However we are a totally separate and independent company from BT, Talk Talk, Italk ,EE , Plusnet.
Wait For cx response!
```

### Compliance Day Verification & Verification Officer Handoff
```text
"Wonderful. To wrap things up, our compliance team requires me to ask a quick verification question to ensure you feel completely comfortable with everything we've discussed. Just for the record, could you confirm for me what day of the week it is today? Is it Sunday, Monday, or Tuesday?"
 Wait For cx response!
"Spot on! The reason I ask is just to ensure we've taken our time today, had a clear conversation, and that you are happy with how everything was explained.
I’m now going to introduce you to my verification officer. They will spend just two minutes re-verifying these details to ensure everything is perfectly accurate and that you've received the exact discount promised. Thank you so much for your time, Mrs. Smith, holding the line for just a moment!"
```

---

## Probability Engine & Qualification Matrix

The script features a built-in **Probability Discovery Engine** that determines customer tariff suitability and savings based on three core qualification questions:

1. **Call Volume**: Quite a lot for making calls vs. Mostly incoming calls
2. **Broadband Presence**: Internet running on the exact same line vs. Landline only
3. **Current Monthly Bill**: Around £40, £50, or over £60/month (with confusion note flag)

### Dynamic Probability Calculations:
- `£[Insert monthly price]`: Resolved dynamically based on probability branch (e.g., £23.99/mo for Landline Only, £32.39/mo for Line + BB, etc.).
- `£[Insert monthly savings]`: `Current Bill - Monthly Price` (e.g., £50.00 - £23.99 = £26.01/mo).
- `£[Insert total 2-year savings]`: `Monthly Savings × 24 Months` (e.g., £26.01 × 24 = £624.24 saved back in customer's pocket).
- `£___` and `£_____`: Effective monthly and 2-year savings reiteration.

---

## Key Features in the Tool
- **Opening Switcher [Opening 1 / Opening 2]**: Seamlessly toggle between Opening 1 (Feedback / 30% reduction) and Opening 2 (Morning digital conversion) right at the top of Step 1.
- **Probability Breakdown Card**: Real-time display of monthly savings and 2-year savings with a toggle to insert live figures into the script text or maintain 100% exact verbatim placeholders.
- **Social Alarm Safety Branching**: Interactive handling for `[If NO]`, `[If YES & Copper]`, and `[If YES & Digital]` (router vs. standard electrical wall socket).
- **Compliance Day Verification ("Sunday, Monday, or Tuesday?")**: Dedicated buttons with instant "Spot on!" validation.
- **21 Acceptance Tests**: Complete test suite validating every step of the script and probability engine.

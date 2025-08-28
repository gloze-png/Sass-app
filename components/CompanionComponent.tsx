"use client"
import { cn, getSubjectColor } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react'
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import soundwaves from '../constants/soundwaves.json';
import { configureAssistant } from "@/lib/utils";
import { addToSessionHistory } from '@/lib/actions/companion.actions';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice}
  : CompanionComponentProps) => {

    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const [isMuted, setIsMuted] = useState(false); // for the microphone button

    const [messages, setMessages] = useState <Message[]>([]); // to store the messages
    

    // to control the lottie animation

    const lottieRef = useRef<LottieRefCurrentProps>(null);
     useEffect (() =>{
      if(lottieRef){
        if(isSpeaking){
          lottieRef.current?.play();
        } else{
          lottieRef.current?.stop();
        }
      }
     }, [isSpeaking, lottieRef]
    )

    // to initiate the call when the component mounts

    useEffect(() => {
      const onCallStart = ()=> setCallStatus (CallStatus.ACTIVE);

      const onCallEnd = ()=> setCallStatus (CallStatus.FINISHED);

      //add to sessionhistory(companionId, subject, topic, style, voice);

      addToSessionHistory(companionId);

      // to handle incoming messages from the assistant
      const onMessage = ( message: Message) => {
        if(message.type === 'transcript' && message.transcriptType ==='final'){
          const newMessage = {
            role: message.role, content: message.transcript}
            //@ts-expect-error
          setMessages((prev) => [newMessage, ...prev]); // add new message to the beginning of the array
          
        }

      };

      const onSpeechStart = () => setIsSpeaking(true);
       const onSpeechEnd = () => setIsSpeaking(false);

      const onError = (error: Error) => console.log('Error',error);
    
    vapi.on ('call-start', onCallStart);
    vapi.on ('call-end', onCallEnd);
    vapi.on ('message', onMessage);
    vapi.on ('message', onError);
    vapi.on ('speech-start', onSpeechStart);
    vapi.on ('speech-end', onSpeechEnd);

    // to keep cleanup the event listeners
    return() => {
      vapi.off ('call-start', onCallStart);
      vapi.off ('call-end', onCallEnd);
      vapi.off ('message', onMessage);
      vapi.off ('message', onError);
      vapi.off ('speech-start', onSpeechStart);
      vapi.off ('speech-end', onSpeechEnd);
    }
  }, []);
// for the microphone button
  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  } 

  // to handle call button
  const handleCall = async() => {
    setCallStatus(CallStatus.CONNECTING);

    const assistantOverrides = {
      variableValues: { subject, topic, style},
      clientMessages: ['transcript'],
      serverMessages: [],

  }
  //@ts-expect-error
  vapi.start (configureAssistant(voice, style), assistantOverrides);

  }
  const handleDisconnect = () =>{
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();

  }

  return (
    <section className=' flex flex-col h-[70hv]'>
      <section className='flex gap-8 max-sm:flex-col'>
        <div className= " companion-section">
          <div className='companion-avatar'
          style={{backgroundColor: getSubjectColor(subject)}}>
            <div 
            className=
            {cn('absolute transition-opacity duration-1000',
              callStatus === CallStatus.FINISHED || 'opacity-100',
              callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0',
              callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'  
              )}> 
              <Image src={`/icons/${subject}.svg`} 
              alt={subject}
              width={150}
              height={150}
              className='max-sm:w-fit'/>
            </div>
            <div className={cn('absolute transition-opacity duration-1000',
              callStatus === CallStatus.ACTIVE ?  'opacity-100' : 'opacity-0')}>
                <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay = {false} 
                className='companion-lottie'
                />
            </div>
            </div>
            <p className='font-bold text-2xl'>{name}</p>
        </div>
        <div className='user-section'>
          <div className='user-avatar'>
            <Image src={userImage} 
            alt={userName}
            width={100}
            height={100}
            className='rounded-lg'/>
            <p className='font-bold text-2xl'>
              {userName}
            </p>
          </div>
          <button className='btn-mic' onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
            <Image src = {isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
            alt= "mic" width={36} height={36} />
            <p className='max-sm:hidden'>
              {isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>
          <button className={cn('rounded-lg py-2 cursor-pointer transition-color w-full text-white', 
            callStatus === CallStatus.ACTIVE ? 'bg-red-700': 'bg-primary',
            callStatus === CallStatus.CONNECTING &&"animate-pulse")}
            onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}>
            {callStatus === CallStatus.ACTIVE ? 'End Call' :
            callStatus === CallStatus.CONNECTING ? 'Connecting...' : 'Start Call'}


          </button>
          <p>Padii will Help you Learn Effectively</p>
        </div>
      </section>
      <section className="tanscript">
        <div className='transcript-messages no-scrollbar'>
         {messages.map((message, index) => {
          //@ts-expect-error
  if (message.role === "assistant") {
    return (
      <p key={index} className="max-sm:text-sm">
        {
          name
            .split(" ")[0]       // split by a single space
            .replace(/[.,]/g, "") // remove dots/commas
        }
        {/* @ts-expect-error */}
        : {message.content}   
      </p>
    );
  } else {
    return (
      <p key={index} className="text-primary max-sm:text-sm">
           {/* @ts-expect-error */}
        {userName}: {message.content}
      </p>
    );
  }
})}
        </div>

        <div className='transcript-fade'/>

      </section>
      </section>
  )
}

export default CompanionComponent
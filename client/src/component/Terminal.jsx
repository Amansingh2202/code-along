import React, { useEffect, useRef } from 'react'
import {Terminal as XTerminal} from "@xterm/xterm"
import { FitAddon } from '@xterm/addon-fit'
import "@xterm/xterm/css/xterm.css";

const Terminal = () => {

    const TermRef=useRef()
    const isRendered=useRef(false);
    const terminalRef=useRef(null);
    const fitAddonRef=useRef(null);

    useEffect(()=>{
        if(isRendered.current) return;
        isRendered.current=true;

        const fitAddon = new FitAddon();
        fitAddonRef.current = fitAddon;

        const term=new XTerminal({
            fontSize: 14,
            fontFamily: 'Consolas, "Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff',
                cursor: '#ffffff'
            }
        });
        
        term.loadAddon(fitAddon);
        term.open(TermRef.current);
        terminalRef.current = term;
        
        // Fit the terminal to container
        fitAddon.fit();

        // if user is typing on terminal
        term.onData(data=>{
            console.log(data);
            
        })

        // Resize terminal when container changes
        const resizeObserver = new ResizeObserver(() => {
            if (fitAddon && term) {
                setTimeout(() => {
                    fitAddon.fit();
                }, 10);
            }
        });
        
        // Also listen for window resize events
        const handleWindowResize = () => {
            if (fitAddon && term) {
                setTimeout(() => {
                    fitAddon.fit();
                }, 10);
            }
        };
        
        window.addEventListener('resize', handleWindowResize);
        
        if (TermRef.current) {
            resizeObserver.observe(TermRef.current);
        }

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleWindowResize);
            term.dispose();
        };

    },[])

  return (
    <div ref={TermRef} style={{height: "100%", width: "100%"}}></div>
  )
}

export default Terminal
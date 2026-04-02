import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { processOperatorInput, generateExecutionPlan } from './CausalityEngine';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Axiom Hive XPII Agent System Initialized. Zero-Drift protocol active. $0 Capital base enforced. Awaiting Operator Input State and Objective.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [pendingSummary, setPendingSummary] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Process logic based on whether we are in a Review Gate or standard input
    if (pendingSummary) {
      // Operator is confirming or rejecting the summary
      if (userMsg.content.toLowerCase() === 'yes' || userMsg.content.toLowerCase() === 'check') {
        const executionPlan = generateExecutionPlan(pendingSummary);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'system',
          content: executionPlan.message,
          executionData: executionPlan.content
        }]);
        setPendingSummary(null);
      } else if (userMsg.content.toLowerCase() === 'no') {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'system',
          content: 'Execution aborted. Review Gate closed. Please provide an updated Input State or Objective.'
        }]);
        setPendingSummary(null);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'system',
          content: 'Unrecognized authorization. Transparency Mandate active. Must provide explicit "Yes" or "check" to authorize, or "No" to abort.'
        }]);
      }
    } else {
      // New task generation causes a unified summary
      const summaryResult = processOperatorInput(userMsg.content);
      setPendingSummary(summaryResult.content);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'system',
        content: summaryResult.message,
        summaryData: summaryResult.content
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar for Navigation/History mapping to NMG Single Source of Truth */}
      <div className="sidebar">
        <div className="sidebar-header">
          <Terminal size={18} color="var(--accent)" />
          <h1>AXIOM XPII / TRL</h1>
        </div>
        <div className="sidebar-content">
          <ul className="session-list">
            <li className="session-item active">Current Workflow</li>
            <li className="session-item">E-Commerce Audit Protocol</li>
            <li className="session-item">VEO Render Optimization</li>
            <li className="session-item">System Governance Rules</li>
          </ul>
        </div>
      </div>

      {/* Main Interface */}
      <div className="main-chat">
        <div className="chat-header">
          <h2>Vector-to-Vector Causation Engine</h2>
          <div className="status-indicator">
            <span className="status-dot"></span>
            Zero-Drift Standard
          </div>
        </div>

        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.type}`}>
              <div className={`avatar ${msg.type}`}>
                {msg.type === 'system' ? <Terminal size={18} /> : <User size={18} />}
              </div>
              <div className="message-content">
                <p>{msg.content}</p>

                {/* Render Review Gate Summary if present */}
                {msg.summaryData && (
                  <div className="review-gate">
                    <div className="review-gate-title">
                      <AlertTriangle size={16} /> 
                      Review Gate: Unified Summary
                    </div>
                    <strong>1. Input State:</strong> <p>{msg.summaryData.inputState}</p>
                    <strong>2. Objective:</strong> <p>{msg.summaryData.objective}</p>
                    <strong>3. Mechanism:</strong> <p>{msg.summaryData.mechanism}</p>
                    <strong>4. Action Steps:</strong>
                    <ul>
                      {msg.summaryData.actionSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                    <strong>5. Outcome Check:</strong> <p>{msg.summaryData.outcomeCheck}</p>
                    
                    <div className="review-gate-actions">
                       <span style={{color: 'var(--success)', fontWeight: 'bold', fontSize: '12px'}}>
                          REQUIREMENT: Respond with 'check' or 'yes' to authorize execution.
                       </span>
                    </div>
                  </div>
                )}

                {/* Render Executable Data if present */}
                {msg.executionData && (
                  <div className="review-gate" style={{ borderColor: 'var(--success)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <div className="review-gate-title" style={{ color: 'var(--success)' }}>
                      <CheckCircle2 size={16} /> 
                      Execution Sequence
                    </div>
                    <ol>
                      {msg.executionData.actionSteps.map((step, i) => <li key={i} style={{marginBottom: '8px'}}>{step}</li>)}
                    </ol>
                    <div style={{marginTop: '12px', borderTop: '1px solid var(--success)', paddingTop: '8px'}}>
                      <strong>Verification:</strong> {msg.executionData.outcomeCheck}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={pendingSummary ? "Provide explicit 'Yes' or 'check' to execute..." : "Input State and Objective here..."}
              rows={1}
            />
            <div className="input-actions">
              <span className="input-hint">
                {pendingSummary ? "Transparency Mandate active" : "Causality protocol strictly enforced"}
              </span>
              <button 
                className="send-btn" 
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

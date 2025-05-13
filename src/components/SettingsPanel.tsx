import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

interface SettingsPanelProps {
  walletAddress: string;
  onClose: () => void;
}

export function SettingsPanel({ walletAddress, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'preferences'>('account');
  
  return (
    <Card className="border-cloud-grey rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="bg-white border-b border-cloud-grey py-4 px-6 flex flex-row justify-between items-center">
        <CardTitle className="text-flow-teal text-lg font-bold">Settings</CardTitle>
        <button 
          onClick={onClose}
          className="text-secondary-text hover:text-deep-ink"
          aria-label="Close settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </CardHeader>
      
      <div className="flex border-b border-cloud-grey">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'account' 
              ? 'text-flow-teal border-b-2 border-flow-teal' 
              : 'text-secondary-text hover:text-deep-ink'
          }`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'security' 
              ? 'text-flow-teal border-b-2 border-flow-teal' 
              : 'text-secondary-text hover:text-deep-ink'
          }`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'preferences' 
              ? 'text-flow-teal border-b-2 border-flow-teal' 
              : 'text-secondary-text hover:text-deep-ink'
          }`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>
      
      <CardContent className="bg-white p-4">
        {activeTab === 'account' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-deep-ink mb-1">Wallet Address</h3>
              <div className="flex items-center gap-2">
                <code className="bg-bg-light-gray p-2 rounded text-xs text-secondary-text flex-1 overflow-x-auto">
                  {walletAddress}
                </code>
                <button 
                  className="p-1 text-secondary-text hover:text-deep-ink"
                  aria-label="Copy wallet address"
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    alert('Wallet address copied to clipboard');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-deep-ink mb-1">Display Name</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  defaultValue="My PointFlow Wallet" 
                  className="flex-1 p-2 rounded-md border border-cloud-grey focus:border-flow-teal focus:ring-1 focus:ring-flow-teal/30 outline-none"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-flow-teal text-flow-teal"
                >
                  Save
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-deep-ink mb-1">Connected Apps</h3>
              <div className="border border-cloud-grey rounded-md divide-y divide-cloud-grey">
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-deep-ink">PointFlow Merchant</div>
                    <div className="text-xs text-secondary-text">Connected on May 5, 2025</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs border-alert-coral text-alert-coral"
                  >
                    Disconnect
                  </Button>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-deep-ink">Solana Pay</div>
                    <div className="text-xs text-secondary-text">Connected on May 2, 2025</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs border-alert-coral text-alert-coral"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-deep-ink mb-1">Biometric Authentication</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-text">Use Face ID or Touch ID for transactions</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-cloud-grey peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cloud-grey after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-flow-teal"></div>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-deep-ink mb-1">Transaction Confirmations</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-text">Require confirmation for all transactions</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-cloud-grey peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cloud-grey after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-flow-teal"></div>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-deep-ink mb-1">Spending Limit</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  defaultValue="1000" 
                  className="w-24 p-2 rounded-md border border-cloud-grey focus:border-flow-teal focus:ring-1 focus:ring-flow-teal/30 outline-none"
                />
                <span className="text-sm text-secondary-text">FP per day</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-auto border-flow-teal text-flow-teal"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-deep-ink mb-1">Appearance</h3>
              <div className="grid grid-cols-3 gap-2">
                <button className="p-2 border border-flow-teal rounded-md text-center bg-bg-light-gray">
                  <div className="h-10 bg-white rounded mb-1 border border-cloud-grey"></div>
                  <span className="text-xs font-medium text-deep-ink">Light</span>
                </button>
                <button className="p-2 border border-cloud-grey rounded-md text-center">
                  <div className="h-10 bg-deep-ink rounded mb-1"></div>
                  <span className="text-xs font-medium text-deep-ink">Dark</span>
                </button>
                <button className="p-2 border border-cloud-grey rounded-md text-center">
                  <div className="h-10 bg-gradient-to-b from-white to-deep-ink rounded mb-1"></div>
                  <span className="text-xs font-medium text-deep-ink">System</span>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-deep-ink mb-1">Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-text">Transaction alerts</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-cloud-grey peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cloud-grey after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-flow-teal"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-text">Reward opportunities</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-cloud-grey peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cloud-grey after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-flow-teal"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-text">Price alerts</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-cloud-grey peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cloud-grey after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-flow-teal"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-deep-ink mb-1">Currency Display</h3>
              <select className="w-full p-2 rounded-md border border-cloud-grey focus:border-flow-teal focus:ring-1 focus:ring-flow-teal/30 outline-none">
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
                <option value="jpy">JPY (¥)</option>
              </select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

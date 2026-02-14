'use client';

import { useState } from 'react';
import { X, Book, Mail, Forward, Globe, CheckCircle, AlertCircle } from 'lucide-react';

export function HelpSlideOver() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Help Button - Fixed position */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white rounded-full p-4 shadow-lg hover:bg-neutral-800 transition-all z-40"
        aria-label="Help"
      >
        <Book className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-semibold">Help & Documentation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto h-[calc(100%-73px)] px-6 py-6 space-y-8">
          
          {/* Getting Started */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Getting Started</h3>
            </div>
            <div className="space-y-4 text-sm text-neutral-700">
              <p>
                Welcome! This app routes incoming emails to Slack or Discord channels. 
                Here's how to set it up in 5 minutes:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Create a Slack or Discord webhook</li>
                <li>Add it in the <strong>Integrations</strong> page</li>
                <li>Add your domain in the <strong>Domains</strong> page</li>
                <li>Create an alias in the <strong>Aliases</strong> page</li>
                <li>Configure DNS (see below)</li>
              </ol>
            </div>
          </section>

          {/* Direct MX Setup */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Option 1: Direct MX Setup</h3>
            </div>
            <div className="space-y-4 text-sm text-neutral-700">
              <p className="font-medium text-neutral-900">
                Best for: New domains or domains not using email yet
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-medium text-blue-900 mb-2">Setup Steps:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>In this app, add your domain (e.g., <code className="bg-blue-100 px-1 rounded">acme.com</code>)</li>
                  <li>You'll see MX records to add</li>
                  <li>Go to your DNS provider (GoDaddy, Namecheap, Cloudflare, etc.)</li>
                  <li>Add the MX records shown</li>
                  <li>Wait 10-30 minutes for DNS propagation</li>
                  <li>Done! Emails will route to Slack/Discord</li>
                </ol>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <p className="font-medium mb-2">Example MX Records:</p>
                <div className="font-mono text-xs space-y-1 text-neutral-600">
                  <div>Type: <span className="text-neutral-900">MX</span></div>
                  <div>Name: <span className="text-neutral-900">@</span></div>
                  <div>Value: <span className="text-neutral-900">mx1.resend.dev</span></div>
                  <div>Priority: <span className="text-neutral-900">10</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* Email Forwarding Setup */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Forward className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Option 2: Email Forwarding</h3>
            </div>
            <div className="space-y-4 text-sm text-neutral-700">
              <p className="font-medium text-neutral-900">
                Best for: Domains already using Zoho, Gmail, Microsoft 365, etc.
              </p>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="font-medium text-purple-900 mb-2">Why use forwarding?</p>
                <p>
                  If you're already receiving emails in Zoho/Gmail/Outlook, you can't 
                  change MX records (they're already in use). Instead, use email forwarding 
                  to get Slack notifications <strong>while keeping your inbox</strong>.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="font-medium text-purple-900 mb-2">Setup Steps:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>In this app, use the Resend test domain:
                    <div className="mt-1 bg-white border border-purple-300 rounded px-2 py-1 font-mono text-xs">
                      galearen.resend.app
                    </div>
                  </li>
                  <li>Create an alias (e.g., <code className="bg-purple-100 px-1 rounded">support@galearen.resend.app</code>)</li>
                  <li>In your email provider, set up auto-forwarding:
                    <div className="mt-2 space-y-1 pl-4">
                      <div>• <strong>Zoho:</strong> Settings → Mail → Forwarding</div>
                      <div>• <strong>Gmail:</strong> Settings → Forwarding and POP/IMAP</div>
                      <div>• <strong>Microsoft 365:</strong> Rules → Forward emails</div>
                    </div>
                  </li>
                  <li>Forward <code className="bg-purple-100 px-1 rounded">support@yourdomain.com</code> to <code className="bg-purple-100 px-1 rounded">support@galearen.resend.app</code></li>
                  <li>Done! Emails go to your inbox AND Slack</li>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-amber-900 text-xs">
                  <strong>Note:</strong> Forwarding adds a 2-5 second delay as the email passes through your inbox first.
                </p>
              </div>
            </div>
          </section>

          {/* Provider-Specific Guides */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Provider-Specific Guides</h3>
            </div>
            
            <div className="space-y-3">
              {/* Zoho */}
              <details className="border border-neutral-200 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer hover:bg-neutral-50 font-medium text-sm">
                  Zoho Mail Forwarding
                </summary>
                <div className="px-4 py-3 border-t border-neutral-200 text-sm text-neutral-700 space-y-2">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Login to Zoho Mail</li>
                    <li>Go to Settings (gear icon)</li>
                    <li>Click "Mail" → "Filters"</li>
                    <li>Create new filter:
                      <div className="ml-4 mt-1 text-xs">
                        • When: "To" contains <code className="bg-neutral-100 px-1">support@yourdomain.com</code><br/>
                        • Action: "Forward to" <code className="bg-neutral-100 px-1">support@galearen.resend.app</code>
                      </div>
                    </li>
                    <li>Save and enable the filter</li>
                  </ol>
                </div>
              </details>

              {/* Gmail */}
              <details className="border border-neutral-200 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer hover:bg-neutral-50 font-medium text-sm">
                  Gmail / Google Workspace Forwarding
                </summary>
                <div className="px-4 py-3 border-t border-neutral-200 text-sm text-neutral-700 space-y-2">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Login to Gmail</li>
                    <li>Click Settings (gear icon) → "See all settings"</li>
                    <li>Go to "Forwarding and POP/IMAP" tab</li>
                    <li>Click "Add a forwarding address"</li>
                    <li>Enter: <code className="bg-neutral-100 px-1">support@galearen.resend.app</code></li>
                    <li>Gmail will send a confirmation email - click the link</li>
                    <li>Go to "Filters and Blocked Addresses" tab</li>
                    <li>Create filter:
                      <div className="ml-4 mt-1 text-xs">
                        • To: <code className="bg-neutral-100 px-1">support@yourdomain.com</code><br/>
                        • Action: "Forward to" → select the Resend address
                      </div>
                    </li>
                  </ol>
                </div>
              </details>

              {/* Microsoft 365 */}
              <details className="border border-neutral-200 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer hover:bg-neutral-50 font-medium text-sm">
                  Microsoft 365 / Outlook Forwarding
                </summary>
                <div className="px-4 py-3 border-t border-neutral-200 text-sm text-neutral-700 space-y-2">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Login to Outlook on the web</li>
                    <li>Click Settings (gear icon) → "View all Outlook settings"</li>
                    <li>Go to "Mail" → "Forwarding"</li>
                    <li>Enable forwarding</li>
                    <li>Enter: <code className="bg-neutral-100 px-1">support@galearen.resend.app</code></li>
                    <li>Choose "Keep a copy of forwarded messages" (optional)</li>
                    <li>Save</li>
                  </ol>
                  <p className="text-xs text-neutral-600 mt-2">
                    Note: For specific addresses, use Inbox Rules instead of global forwarding.
                  </p>
                </div>
              </details>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold">Troubleshooting</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <details className="border border-neutral-200 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer hover:bg-neutral-50 font-medium">
                  Emails not appearing in Slack
                </summary>
                <div className="px-4 py-3 border-t border-neutral-200 text-neutral-700 space-y-2">
                  <p className="font-medium">Check these items:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Is the Slack webhook URL correct?</li>
                    <li>Is the alias created and linked to the integration?</li>
                    <li>Did DNS propagate? (Can take 10-30 minutes)</li>
                    <li>For forwarding: Is the forwarding rule enabled?</li>
                  </ul>
                  <p className="text-xs text-neutral-600 mt-2">
                    Check Vercel logs for detailed error messages.
                  </p>
                </div>
              </details>

              <details className="border border-neutral-200 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer hover:bg-neutral-50 font-medium">
                  DNS changes not working
                </summary>
                <div className="px-4 py-3 border-t border-neutral-200 text-neutral-700 space-y-2">
                  <p>DNS propagation can take time:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Typically: 10-30 minutes</li>
                    <li>Maximum: Up to 48 hours (rare)</li>
                  </ul>
                  <p className="mt-2">Check DNS with online tools:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><a href="https://mxtoolbox.com" target="_blank" className="text-blue-600 hover:underline">MXToolbox.com</a></li>
                    <li><a href="https://dnschecker.org" target="_blank" className="text-blue-600 hover:underline">DNSChecker.org</a></li>
                  </ul>
                </div>
              </details>

              <details className="border border-neutral-200 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer hover:bg-neutral-50 font-medium">
                  Can I use custom domain instead of Resend domain?
                </summary>
                <div className="px-4 py-3 border-t border-neutral-200 text-neutral-700 space-y-2">
                  <p>
                    Yes! For custom domain support (receiving at your actual domain like 
                    <code className="bg-neutral-100 px-1 mx-1">support@yourdomain.com</code>), 
                    you need to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Use the Direct MX Setup method</li>
                    <li>Point your domain's MX records to Resend</li>
                    <li>Cannot keep existing email provider (MX conflict)</li>
                  </ul>
                  <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                    If you need both inbox AND Slack, use the Email Forwarding method instead.
                  </p>
                </div>
              </details>
            </div>
          </section>

          {/* FAQ */}
          <section className="pb-8">
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-neutral-900">How much does this cost?</p>
                <p className="text-neutral-600 mt-1">
                  Currently in beta - free to use! Pricing will be announced soon.
                </p>
              </div>

              <div>
                <p className="font-medium text-neutral-900">Can I reply to emails from Slack?</p>
                <p className="text-neutral-600 mt-1">
                  Not yet! This is a planned feature for the future. For now, you'll need 
                  to reply from your email client.
                </p>
              </div>

              <div>
                <p className="font-medium text-neutral-900">How many aliases can I create?</p>
                <p className="text-neutral-600 mt-1">
                  Currently unlimited during beta. Limits may apply after launch.
                </p>
              </div>

              <div>
                <p className="font-medium text-neutral-900">Is my email data secure?</p>
                <p className="text-neutral-600 mt-1">
                  Yes! Emails are processed in real-time and not stored. Only metadata 
                  (sender, subject) is logged temporarily for debugging.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
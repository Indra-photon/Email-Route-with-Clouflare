"use client";

import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Clock, ShieldCheck } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <Container className="border-b border-neutral-200 bg-white py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium text-sky-600 font-schibsted uppercase tracking-wider">
            Support Center
          </p>
          <Heading as="h1" className="mb-6 text-neutral-900 text-4xl md:text-5xl font-bold tracking-tight">
            How can we help you today?
          </Heading>
          <Paragraph className="text-neutral-600 text-lg md:text-xl max-w-2xl leading-relaxed">
            Have questions about SyncSupport? Our team is here to help you get the most out of your Slack-native support system.
          </Paragraph>
        </div>
      </Container>

      {/* Quick Contact Cards */}
      <Container className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-neutral-200 bg-neutral-50 hover:border-sky-200 transition-all group">
            <div className="size-12 rounded-xl bg-sky-100 flex items-center justify-center mb-6 group-hover:bg-sky-600 transition-colors">
              <Mail className="size-6 text-sky-600 group-hover:text-white" />
            </div>
            <Heading as="h3" className="text-xl mb-3 text-neutral-900">Email Us</Heading>
            <Paragraph className="text-neutral-600 mb-6">
              For general inquiries and technical support. We typically respond within 2-4 hours.
            </Paragraph>
            <a 
              href="mailto:support@syncsupport.app" 
              className="text-sky-600 font-medium hover:text-sky-700 transition-colors inline-flex items-center gap-2"
            >
              support@syncsupport.app
            </a>
          </div>

          <div className="p-8 rounded-2xl border border-neutral-200 bg-neutral-50 hover:border-sky-200 transition-all group">
            <div className="size-12 rounded-xl bg-sky-100 flex items-center justify-center mb-6 group-hover:bg-sky-600 transition-colors">
              <MessageSquare className="size-6 text-sky-600 group-hover:text-white" />
            </div>
            <Heading as="h3" className="text-xl mb-3 text-neutral-900">Slack Community</Heading>
            <Paragraph className="text-neutral-600 mb-6">
              Join our Slack community to chat with the team and other users in real-time.
            </Paragraph>
            <Button variant="outline" className="w-full rounded-xl border-neutral-200">
              Join Community
            </Button>
          </div>

          <div className="p-8 rounded-2xl border border-neutral-200 bg-neutral-50 hover:border-sky-200 transition-all group">
            <div className="size-12 rounded-xl bg-sky-100 flex items-center justify-center mb-6 group-hover:bg-sky-600 transition-colors">
              <Clock className="size-6 text-sky-600 group-hover:text-white" />
            </div>
            <Heading as="h3" className="text-xl mb-3 text-neutral-900">Response Times</Heading>
            <ul className="space-y-3 text-neutral-600 font-schibsted text-sm">
              <li className="flex justify-between items-center border-b border-neutral-200 pb-2">
                <span>Free Plan</span>
                <span className="font-medium text-neutral-900">24h</span>
              </li>
              <li className="flex justify-between items-center border-b border-neutral-200 pb-2">
                <span>Pro Plan</span>
                <span className="font-medium text-neutral-900">4h</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Enterprise</span>
                <span className="font-medium text-neutral-900">1h</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Support Form Section */}
      <div className="bg-neutral-50 border-y border-neutral-200 py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <Heading as="h2" className="text-3xl mb-4 text-neutral-900">Send us a message</Heading>
                <Paragraph className="text-neutral-600">
                  Can't find what you're looking for? Fill out the form and our support team will get back to you as soon as possible.
                </Paragraph>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="size-6 rounded-full bg-sky-100 flex items-center justify-center mt-1">
                    <ShieldCheck className="size-4 text-sky-600" />
                  </div>
                  <div>
                    <Heading as="h4" className="text-base text-neutral-900 mb-1">Secure & Private</Heading>
                    <Paragraph className="text-sm text-neutral-500">Your data is encrypted and handled according to our privacy policy.</Paragraph>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl border border-neutral-200 shadow-sm">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 ml-1">Name</label>
                    <Input placeholder="John Doe" className="rounded-xl border-neutral-200 focus:ring-sky-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 ml-1">Email</label>
                    <Input type="email" placeholder="john@example.com" className="rounded-xl border-neutral-200 focus:ring-sky-500/20" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 ml-1">Subject</label>
                  <Input placeholder="How do I set up custom domains?" className="rounded-xl border-neutral-200 focus:ring-sky-500/20" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 ml-1">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your issue..." 
                    className="min-h-[150px] rounded-xl border-neutral-200 focus:ring-sky-500/20 resize-none" 
                  />
                </div>

                <Button className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-all shadow-lg shadow-sky-600/10">
                  Send Message
                </Button>
                
                <p className="text-xs text-neutral-400 text-center">
                  By submitting this form, you agree to our <a href="/privacy" className="text-sky-600 underline">Privacy Policy</a>.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </div>

      {/* Trust Section */}
      <Container className="py-20 text-center">
        <Paragraph className="text-neutral-400 uppercase tracking-widest text-xs font-semibold mb-8">
          Trusted by teams at
        </Paragraph>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
          {/* Add your logo placeholders or icons here */}
          <div className="text-2xl font-bold text-neutral-900">SYNC</div>
          <div className="text-2xl font-bold text-neutral-900">SUPPORT</div>
          <div className="text-2xl font-bold text-neutral-900">FLOW</div>
          <div className="text-2xl font-bold text-neutral-900">BASE</div>
        </div>
      </Container>
    </main>
  );
}

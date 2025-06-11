'use client'

import { MDXProvider } from '@mdx-js/react'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import '../css/style.css'
import 'prism-themes/themes/prism-vsc-dark-plus.css'

import websiteJson from '../website.json'
import { MDXComponents } from '../components/MDXComponents'
import { DefaultSEOProps } from '../components/SEO'
import { BlogContext } from '../lib/BlogContext'
import { useGoogleAnalytics } from '../lib/useGoogleAnalytics'
import { useTypeSquareJS } from '../lib/useTypeSquareJS'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  useTypeSquareJS()
  useGoogleAnalytics()
  return (
    <html lang="en">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="stylesheet" href="/stylesheets/main.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(d){var config={kitId:"tor0txx",scriptTimeout:3000,async:true},h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)})(document);`
          }}
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_TRACKING_ID}',{page_path:window.location.pathname});`
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return t;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));`
          }}
        />
      </Head>
      <body>
        <MDXProvider components={MDXComponents}>
          <BlogContext.Provider
            value={{
              language: 'default',
              rootPath: websiteJson.rootPath,
              imageRoot: websiteJson.imageRoot,
              sourceRoot: websiteJson.sourceRoot,
              maxPosts: websiteJson.maxPosts,
              ...websiteJson.languages.default
            }}
          >
            <DefaultSeo {...DefaultSEOProps} />
            {children}
          </BlogContext.Provider>
        </MDXProvider>
      </body>
    </html>
  )
}

const GA_TRACKING_ID = require('../lib/useGoogleAnalytics').GA_TRACKING_ID

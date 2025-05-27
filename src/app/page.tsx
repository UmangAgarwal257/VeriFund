import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Shield, Users, TrendingUp, CheckCircle, ArrowRight, Vote, Eye, Clock, Coins } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function VeriFundLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-black" />
          </div>
          <span className="ml-2 text-xl font-bold">VeriFund</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-emerald-400 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-emerald-400 transition-colors">
            Process
          </Link>
          <Link href="#projects" className="text-sm font-medium hover:text-emerald-400 transition-colors">
            Projects
          </Link>
          <Button variant="outline" size="sm" className="hidden sm:flex border-gray-700 hover:bg-gray-800">
            Launch App
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10"></div>
          <div className="container px-4 md:px-6 mx-auto relative">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <Badge variant="secondary" className="bg-gray-800 text-emerald-400 border-gray-700">
                Community-Verified Funding
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Fund projects that{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  matter
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                A crowdfunding platform where community members vouch for projects before they go live. No more scams,
                no more broken promises.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black font-semibold"
                >
                  Explore Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="border-gray-700 hover:bg-gray-800">
                  Submit Your Project
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">$847K</div>
                  <div className="text-sm text-gray-500">Total Funded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">2,341</div>
                  <div className="text-sm text-gray-500">Active Vouchers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">127</div>
                  <div className="text-sm text-gray-500">Funded Projects</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Project */}
        <section className="w-full py-16 bg-gray-900/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Currently Trending</h2>
              <p className="text-gray-400">Projects that caught the community`&apos;`s attention</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="bg-gray-800 border-gray-700 hover:border-emerald-500/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                      92 vouches
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">1.2k</span>
                    </div>
                  </div>
                  <Image
                    src="/placeholder.svg?height=160&width=280"
                    alt="Project"
                    width={280}
                    height={160}
                    className="rounded-lg object-cover w-full"
                  />
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Ocean Cleanup Drone</h3>
                  <p className="text-sm text-gray-400 mb-4">Autonomous drones for removing plastic from oceans</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Raised</span>
                      <span className="font-medium">$23,400 / $35,000</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: "67%" }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>18 days left</span>
                      <span>156 backers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-emerald-500/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                      67 vouches
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">890</span>
                    </div>
                  </div>
                  <Image
                    src="/placeholder.svg?height=160&width=280"
                    alt="Project"
                    width={280}
                    height={160}
                    className="rounded-lg object-cover w-full"
                  />
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Urban Vertical Farm</h3>
                  <p className="text-sm text-gray-400 mb-4">Sustainable food production in city centers</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Raised</span>
                      <span className="font-medium">$41,200 / $50,000</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: "82%" }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>25 days left</span>
                      <span>203 backers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-emerald-500/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                      45 vouches
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">654</span>
                    </div>
                  </div>
                  <Image
                    src="/placeholder.svg?height=160&width=280"
                    alt="Project"
                    width={280}
                    height={160}
                    className="rounded-lg object-cover w-full"
                  />
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">AI Learning Assistant</h3>
                  <p className="text-sm text-gray-400 mb-4">Personalized education for underserved communities</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Raised</span>
                      <span className="font-medium">$12,800 / $28,000</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: "46%" }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>32 days left</span>
                      <span>89 backers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Vouching Works</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Community verification ensures only legitimate projects get funded
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Vote className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold">Submit & Review</h3>
                <p className="text-gray-400">
                  Creators submit projects with detailed plans. Community members review and verify legitimacy before
                  vouching.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold">Community Vouching</h3>
                <p className="text-gray-400">
                  Trusted members stake their reputation to vouch for projects. More vouches = higher visibility and
                  trust.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Coins className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold">Fund & Deliver</h3>
                <p className="text-gray-400">
                  Vouched projects go live for funding. Milestone-based releases ensure accountability and successful
                  delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="w-full py-20 bg-gray-900/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose VeriFund?</h2>
                  <p className="text-gray-400 text-lg">
                    Built for creators and backers who want transparency and accountability in crowdfunding.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Community Verification</h3>
                      <p className="text-gray-400">
                        Projects are reviewed by experienced community members who stake their reputation on quality.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Milestone Funding</h3>
                      <p className="text-gray-400">
                        Funds are released as creators hit verified milestones, reducing risk for everyone involved.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Reputation System</h3>
                      <p className="text-gray-400">
                        Build your reputation by vouching for successful projects and creating quality campaigns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
                <Card className="relative bg-gray-800/80 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                        Verification Process
                      </Badge>
                      <div className="text-sm text-gray-400">Live Example</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm">Project details verified</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm">Team credentials checked</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm">Budget breakdown reviewed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-gray-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-sm text-gray-400">Community voting in progress...</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Vouches needed</span>
                        <span>23 / 30</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: "77%" }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"></div>
          <div className="container px-4 md:px-6 mx-auto relative">
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold">Ready to fund the future?</h2>
              <p className="text-xl text-gray-400">
                Join a community that believes in backing projects that actually deliver.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black font-semibold"
                >
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="border-gray-700 hover:bg-gray-800">
                  Submit Your Project
                </Button>
              </div>

              <p className="text-sm text-gray-500">No wallet required to browse • Connect when you`&apos;`re ready to fund</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-gray-900/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded flex items-center justify-center">
                  <Shield className="h-4 w-4 text-black" />
                </div>
                <span className="font-bold">VeriFund</span>
              </div>
              <p className="text-sm text-gray-400">Community-verified crowdfunding for projects that matter.</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/explore" className="block hover:text-white transition-colors">
                  Explore Projects
                </Link>
                <Link href="/submit" className="block hover:text-white transition-colors">
                  Submit Project
                </Link>
                <Link href="/vouchers" className="block hover:text-white transition-colors">
                  Become a Voucher
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/how-it-works" className="block hover:text-white transition-colors">
                  How It Works
                </Link>
                <Link href="/guidelines" className="block hover:text-white transition-colors">
                  Project Guidelines
                </Link>
                <Link href="/faq" className="block hover:text-white transition-colors">
                  FAQ
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/about" className="block hover:text-white transition-colors">
                  About
                </Link>
                <Link href="/terms" className="block hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="block hover:text-white transition-colors">
                  Privacy
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2024 VeriFund. Building trust in crowdfunding.
          </div>
        </div>
      </footer>
    </div>
  )
}

import { XIcon, MailIcon } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <XIcon size={24} />
                </button>

                <div className="p-8 space-y-6">

                    {/* ABOUT SECTION */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-foreground">About</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            DSAtyping is a dangerously addictive typing tool that lets you test how fast you can
                            type Java code… because why type normal English when you can stress yourself with
                            semicolons and brackets instead? This project started as a “simple idea” and ended as
                            “what if LeetCode became a typing game?”
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            After sweating through Monkeytype and feeling like a typing champion, I wondered — why
                            isn’t there a version where you type actual DSA code? Couldn’t find one. So I built
                            one. If you enjoy suffering through algorithms, welcome home.
                        </p>
                    </div>

                    {/* MADE BY */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">Made By</h3>
                        <p className="text-muted-foreground">
                            Aman Shekhar — the guy who thought, “What if typing pain and DSA pain were… the same thing?”
                        </p>
                    </div>

                    {/* OBJECTIVE */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">Objective</h3>
                        <p className="text-muted-foreground">
                            Start algorithms faster, revise without pretending to revise, and proudly waste time
                            here instead of Monkeytype. At least now your procrastination looks productive.
                        </p>
                    </div>

                    {/* CONTACT */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">Contact</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MailIcon size={18} />
                            <a
                                href="mailto:amanshekhar000@gmail.com"
                                className="hover:text-primary transition-colors"
                            >
                                amanshekhar000@gmail.com — yes, this is my real email. No, I won’t solve your DP problems.
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

<script>
	import { goto } from '$app/navigation';

	function goBack() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Disclaimer - Jac-Man Portfolio</title>
</svelte:head>

<div class="disclaimer-page">
	<div class="disclaimer-container">
		<div class="disclaimer-header">
			<h1 class="pixel-title">LEGAL DISCLAIMER</h1>
			<div class="pixel-divider"></div>
		</div>

		<div class="disclaimer-content">
			<section class="disclaimer-section legal-notice">
				<p class="legal-preamble">
					<strong>PLEASE READ THIS LEGAL NOTICE CAREFULLY.</strong> This disclaimer constitutes a legally binding statement 
					regarding the intellectual property rights, fair use claims, and legal protections applicable to this website.
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>I. NATURE OF THIS WORK</h2>
				<p>
					This website, operating under the title "JAC-MAN," constitutes a <strong>transformative parody work</strong> 
					created for the express purposes of: (a) demonstrating technical proficiency in web development and software engineering; 
					(b) serving as an interactive portfolio navigation system; and (c) providing commentary on and homage to classic 
					arcade gaming culture. This work is presented solely as a personal portfolio project and educational demonstration.
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>II. FAIR USE DEFENSE UNDER 17 U.S.C. § 107</h2>
				<p>
					This work asserts protection under the Fair Use doctrine as codified in Title 17, Section 107 of the United States Code. 
					The four-factor analysis supporting this fair use claim is as follows:
				</p>
				
				<h3 class="subsection-title">A. Purpose and Character of Use (Transformative)</h3>
				<ul class="legal-list">
					<li><strong>Non-commercial Educational Purpose:</strong> This website serves exclusively as a portfolio demonstration 
					showcasing technical skills in front-end development, game logic implementation, and interactive design. No commercial 
					benefit, monetary gain, or competitive market advantage is sought or derived from this work.</li>
					
					<li><strong>Transformative Nature:</strong> Unlike the original work referenced (Pac-Man™), which functions as commercial 
					entertainment software, JAC-MAN operates fundamentally differently as a portfolio navigation interface. The underlying 
					purpose has been transformed from entertainment consumption to professional skills demonstration and career content delivery.</li>
					
					<li><strong>Parody and Commentary:</strong> This work constitutes parody by using recognizable arcade game conventions 
					to comment on and celebrate retro gaming culture while simultaneously subverting those conventions for an entirely 
					different functional purpose (career portfolio navigation).</li>
				</ul>

				<h3 class="subsection-title">B. Nature of the Copyrighted Work</h3>
				<p>
					While the referenced work (Pac-Man™) is a creative, copyrighted work, this factor is given less weight in parody 
					cases. See <em>Campbell v. Acuff-Rose Music, Inc.</em>, 510 U.S. 569 (1994) (holding that parody has an obvious 
					claim to transformative value and the nature of the copyrighted work is less important in parody analysis).
				</p>

				<h3 class="subsection-title">C. Amount and Substantiality Used</h3>
				<p>
					This work deliberately incorporates only those elements necessary to "conjure up" the original for purposes of parody:
				</p>
				<ul class="legal-list">
					<li>Generic maze navigation mechanics (not protectable as ideas under <em>Baker v. Selden</em>)</li>
					<li>Modified visual presentation with distinct color palette (Matrix green vs. classic yellow)</li>
					<li>Different character design ("bugs" with angular, technical aesthetics vs. rounded characters)</li>
					<li>Alternative terminology ("code bits," "debug mode," "bugs" vs. original game terms)</li>
					<li>Unique functional elements (portfolio page integration, randomized mazes, career content)</li>
				</ul>

				<h3 class="subsection-title">D. Effect on the Market</h3>
				<p>
					This work creates <strong>no market substitution effect</strong> and does not compete with or diminish the market 
					for the original work. The target audiences are entirely distinct: (i) this work targets potential employers, 
					clients, and professional contacts evaluating technical capabilities; (ii) the original work targets consumers 
					of entertainment software. No reasonable consumer would substitute this portfolio interface for the original 
					commercial game product. Furthermore, this work is not offered for sale, license, or commercial distribution.
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>III. TRADEMARK DISCLAIMER AND NON-AFFILIATION</h2>
				<p class="legal-emphasis">
					<strong>JAC-MAN IS NOT AFFILIATED WITH, ENDORSED BY, SPONSORED BY, OR CONNECTED IN ANY MANNER TO 
					PAC-MAN™ OR BANDAI NAMCO ENTERTAINMENT INC.</strong>
				</p>
				<p>
					"Pac-Man" and all related trademarks, service marks, and trade dress are the exclusive property of Bandai Namco 
					Entertainment Inc. and/or its subsidiaries, affiliates, or licensors. All rights reserved by respective trademark holders.
				</p>
				<p>
					The name "JAC-MAN" is used as a personalized parody moniker derived from the creator's given name (Jack Abeyta) 
					and constitutes nominative fair use under trademark law to the extent it evokes the original mark for purposes 
					of parody. See <em>New Kids on the Block v. News Am. Publ'g, Inc.</em>, 971 F.2d 302 (9th Cir. 1992) 
					(establishing nominative fair use defense).
				</p>
				<p>
					No confusion, sponsorship, or affiliation is intended or should be inferred. The use of arcade-style game mechanics 
					serves solely to create an engaging interface for portfolio content and does not constitute trademark infringement 
					under the Lanham Act, 15 U.S.C. § 1125(a).
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>IV. TRANSFORMATIVE ELEMENTS AND DIFFERENTIATION</h2>
				<p>
					This work incorporates substantial transformative elements that clearly distinguish it from any referenced original work:
				</p>
				<ul class="legal-list">
					<li><strong>Distinct Visual Presentation:</strong> Modified color scheme utilizing Matrix-inspired green (#00FF41) 
					instead of classic yellow; angular "bug" entities with technical design language replacing rounded character designs; 
					altered aesthetic presentation throughout.</li>
					
					<li><strong>Different Functional Purpose:</strong> Portfolio navigation and career content delivery system rather 
					than entertainment software; integration with professional content (experience, projects, achievements).</li>
					
					<li><strong>Modified Terminology:</strong> Technical/developer-themed language ("code bits," "debug mode," "bugs," 
					"catch bugs") replacing traditional gaming terminology.</li>
					
					<li><strong>Unique Technical Features:</strong> Dynamic maze generation algorithms; portfolio page routing integration; 
					session state management; responsive navigation systems.</li>
					
					<li><strong>Educational Context:</strong> Presented explicitly as a demonstration of technical skills including 
					front-end development, game loop implementation, state management, and UI/UX design.</li>
				</ul>
			</section>

			<section class="disclaimer-section">
				<h2>V. COPYRIGHT OWNERSHIP AND ORIGINAL CONTENT</h2>
				<p>
					Copyright © 2025 Jack Abeyta. All rights reserved.
				</p>
				<p>
					All original code, design implementations, written content, project descriptions, and creative works presented on 
					this website are the exclusive intellectual property of Jack Abeyta, except where explicitly attributed to third parties 
					or where fair use of others' works is claimed. This includes but is not limited to:
				</p>
				<ul class="legal-list">
					<li>Original source code and software implementations</li>
					<li>Custom visual designs, layouts, and user interface elements</li>
					<li>Written content, project descriptions, and portfolio materials</li>
					<li>Unique game mechanics and technical implementations</li>
				</ul>
				<p>
					The arcade-style navigation mechanism is presented as a transformative parody work and does not constitute a claim 
					to ownership of underlying game concepts, which are acknowledged to be either (a) non-protectable ideas under 
					copyright law, or (b) the property of their respective owners where specific expression is concerned.
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>VI. NON-COMMERCIAL USE AND INTENT</h2>
				<p>
					This website is operated exclusively for non-commercial purposes as a personal portfolio and professional 
					presentation tool. Specifically:
				</p>
				<ul class="legal-list">
					<li>No products or services are offered for sale through this website</li>
					<li>No advertising revenue or commercial gain is derived from this website</li>
					<li>No licensing, distribution, or commercialization of any arcade-style game is conducted</li>
					<li>The sole purpose is career advancement through demonstration of technical competence</li>
				</ul>
				<p>
					This non-commercial nature weighs heavily in favor of fair use protection. See <em>Sony Corp. of Am. v. Universal 
					City Studios, Inc.</em>, 464 U.S. 417, 451 (1984).
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>VII. LIMITATION OF LIABILITY</h2>
				<p>
					This website and all content are provided "AS IS" without warranty of any kind, either express or implied, including 
					but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. The creator 
					makes no representations or warranties regarding the accuracy, completeness, or availability of any content.
				</p>
				<p>
					To the fullest extent permitted by applicable law, the creator shall not be liable for any direct, indirect, incidental, 
					consequential, special, or exemplary damages arising from use of this website, even if advised of the possibility of 
					such damages.
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>VIII. DMCA COMPLIANCE AND TAKEDOWN PROCEDURES</h2>
				<p>
					The creator respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act 
					(DMCA), 17 U.S.C. § 512. While the creator maintains in good faith that this work constitutes fair use and does not 
					infringe any valid intellectual property rights, if you believe that content on this website infringes your copyright:
				</p>
				<p>
					You may submit a notice of claimed infringement containing: (a) identification of the copyrighted work claimed to be 
					infringed; (b) identification of the material claimed to be infringing; (c) your contact information; (d) a statement 
					of good faith belief that the use is not authorized; (e) a statement under penalty of perjury that the information is 
					accurate and you are authorized to act; and (f) your physical or electronic signature.
				</p>
				<p>
					The creator will review all notices in good faith and respond appropriately, including removing content if legally 
					required, while reserving all rights to assert fair use and other applicable defenses.
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>IX. GEOGRAPHIC SCOPE AND GOVERNING LAW</h2>
				<p>
					This disclaimer and the legal protections claimed herein are asserted primarily under United States federal law, 
					including the Copyright Act of 1976 (17 U.S.C. § 101 et seq.) and the Lanham Act (15 U.S.C. § 1051 et seq.). 
					The creator acknowledges that intellectual property laws vary by jurisdiction and makes no representations regarding 
					the legal status of this work in jurisdictions outside the United States.
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>X. SEVERABILITY</h2>
				<p>
					If any provision of this disclaimer is found to be unenforceable or invalid under applicable law, such unenforceability 
					or invalidity shall not render this disclaimer unenforceable or invalid as a whole. Such provisions shall be deleted 
					without affecting the remaining provisions herein.
				</p>
			</section>

			<section class="disclaimer-section">
				<h2>XI. RESERVATION OF RIGHTS</h2>
				<p>
					All rights not expressly granted herein are reserved. Nothing in this disclaimer shall be construed as a waiver of any 
					rights under applicable law, including but not limited to fair use rights, First Amendment protections, or other 
					statutory or common law privileges.
				</p>
			</section>

			<section class="disclaimer-section contact-section">
				<h2>XII. CONTACT FOR LEGAL INQUIRIES</h2>
				<p>
					For questions, concerns, or legal inquiries regarding intellectual property matters related to this website, 
					please contact the creator directly. The creator maintains a commitment to good faith dialogue and will address 
					all legitimate intellectual property concerns with appropriate consideration and legal analysis.
				</p>
				<p class="legal-emphasis">
					<strong>Last Updated:</strong> October 23, 2025
				</p>
			</section>
		</div>

		<div class="disclaimer-footer">
			<button class="pixel-button" onclick={goBack}>
				<span class="button-icon">←</span>
				<span class="button-text">BACK TO GAME</span>
			</button>
		</div>
	</div>
</div>

<style>
	.disclaimer-page {
		min-height: 100vh;
		height: 100vh;
		background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
		color: #00FF41;
		font-family: 'Courier New', monospace;
		padding: 2rem;
		overflow-y: scroll;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
	}

	.disclaimer-container {
		max-width: 900px;
		margin: 0 auto 2rem auto;
		background: rgba(10, 10, 15, 0.8);
		border: 3px solid #00FF41;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
	}

	.disclaimer-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.pixel-title {
		font-size: 2.5rem;
		color: #00FF41;
		text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
		margin: 0 0 1rem 0;
		letter-spacing: 0.2em;
	}

	.pixel-divider {
		height: 3px;
		background: linear-gradient(90deg, 
			transparent 0%, 
			#00FF41 25%, 
			#00FF41 75%, 
			transparent 100%);
		margin: 0 auto;
		width: 60%;
	}

	.disclaimer-content {
		line-height: 1.8;
		color: #e0e0e0;
	}

	.disclaimer-section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: rgba(0, 255, 65, 0.03);
		border-left: 3px solid #00FF41;
		border-radius: 4px;
	}

	.disclaimer-section h2 {
		color: #00FF41;
		font-size: 1.5rem;
		margin: 0 0 1rem 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.disclaimer-section p {
		margin: 0.75rem 0;
		color: #d0d0d0;
	}

	.disclaimer-section ul {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	.disclaimer-section li {
		margin: 0.5rem 0;
		color: #d0d0d0;
	}

	.disclaimer-section strong {
		color: #00FF41;
		font-weight: bold;
	}

	.legal-notice {
		background: rgba(255, 255, 0, 0.05);
		border-left-color: #FFFF00;
	}

	.legal-preamble {
		font-size: 0.95rem;
		color: #f0f0f0;
		font-weight: 500;
	}

	.subsection-title {
		color: #00FFFF;
		font-size: 1.1rem;
		margin: 1.5rem 0 0.75rem 0;
		font-weight: 600;
	}

	.legal-list {
		list-style-type: none;
		padding-left: 0;
	}

	.legal-list li {
		margin: 1rem 0;
		padding-left: 1.5rem;
		position: relative;
	}

	.legal-list li::before {
		content: "§";
		position: absolute;
		left: 0;
		color: #00FF41;
		font-weight: bold;
	}

	.legal-emphasis {
		background: rgba(255, 255, 0, 0.1);
		padding: 1rem;
		border-left: 4px solid #FFFF00;
		margin: 1.5rem 0;
		font-weight: 500;
	}

	.contact-section {
		background: rgba(0, 255, 255, 0.05);
		border-left-color: #00FFFF;
	}

	em {
		color: #00FFFF;
		font-style: italic;
	}

	.disclaimer-footer {
		margin-top: 2rem;
		text-align: center;
		padding-top: 2rem;
		border-top: 2px solid rgba(0, 255, 65, 0.2);
	}

	.pixel-button {
		background: rgba(0, 255, 65, 0.1);
		color: #00FF41;
		border: 2px solid #00FF41;
		padding: 1rem 2rem;
		font-size: 1.1rem;
		font-family: 'Courier New', monospace;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 4px;
		letter-spacing: 0.1em;
	}

	.pixel-button:hover {
		background: rgba(0, 255, 65, 0.2);
		box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
		transform: translateY(-2px);
	}

	.pixel-button:active {
		transform: translateY(0);
	}

	.button-icon {
		font-size: 1.3rem;
	}

	@media (max-width: 768px) {
		.disclaimer-page {
			padding: 1rem;
		}

		.disclaimer-container {
			padding: 1.5rem;
		}

		.pixel-title {
			font-size: 1.8rem;
		}

		.disclaimer-section {
			padding: 1rem;
		}

		.disclaimer-section h2 {
			font-size: 1.2rem;
		}
	}
</style>

import { LightningElement, track } from "lwc";

export default class Blackjack extends LightningElement {
  @track totalchips = 100;
  @track mybet = 0;
  @track dealerscards = "";
  @track mycards = "";
  @track mysum = 0;
  @track dealersum = 0;
  @track p1 = "";
  @track p2;
  @track d1;
  @track d2 = 1;
  @track console1 = " Welcome to Blackjack!";
  @track console2 = "Goal: Beat the dealer without going over 21";
  @track console3 = "To Start: Select your bet, and click Deal Hand";
  @track bust = "False";
  @track canbet = "True";
  @track candd = "False";
  @track canhit = "False";
  @track canstand = "False";

  stand() {
    if (this.bust === "False" && this.canstand === "True") {
      this.candd = "False";
      this.canhit = "False";
      this.mysum = this.sumcards(this.mycards);
      this.d2 = this.drawcard();
      this.dealerscards = this.d1 + ", " + this.d2;
      this.dealersum = this.sumcards(this.dealerscards);
      while (this.dealersum < 17) {
        this.dealerscards = this.dealerscards + ", " + this.drawcard();
        this.dealersum = this.sumcards(this.dealerscards);
      }
      if (this.dealersum > 21) {
        this.console1 = "Dealer BUSTED with a total of: " + this.dealersum;
      } else {
        this.console1 = "Dealer total is: " + this.dealersum;
      }
      if (this.dealersum > this.mysum && this.dealersum < 22) {
        this.console1 = " Dealer WON with a total of: " + this.dealersum;
        this.console3 = "You lost " + this.mybet + " chips.  Another hand?";
      } else if (this.dealersum < this.mysum || this.dealersum > 21) {
        this.totalchips = this.totalchips + 2 * this.mybet;
        this.console2 =
          " You WON with a total of: " + this.sumcards(this.mycards);
        this.console3 = "You won " + 2 * this.mybet + " chips.  Another hand?";
      } else if (this.dealersum === this.mysum) {
        this.totalchips = this.totalchips + this.mybet;
        this.console2 =
          " You TIED with a total of: " + this.sumcards(this.mycards);
        this.console3 = "You won " + this.mybet + " chips.  Another hand?";
      }
      this.mybet = 0;
      this.canbet = "True";
      this.canstand = "False";
    }
  }

  doubledown() {
    if (this.candd === "True" && this.totalchips >= this.mybet) {
      this.totalchips = this.totalchips - this.mybet;
      this.mybet = 2 * this.mybet;
      this.hit();
      if (this.bust === "False") {
        this.canstand = "True";
        this.stand();
      }
    }
  }
  drawcard() {
    var card = Math.floor(Math.random() * 13 + 2);
    if (card === 11) {
      card = "Jack";
    } else if (card === 12) {
      card = "Queen";
    } else if (card === 13) {
      card = "King";
    } else if (card === 14) {
      card = "Ace";
    } else {
      return card;
    }
    return card;
  }

  betfive() {
    if (this.canbet === "True") {
      if (this.totalchips >= 5) {
        this.mybet += 5;
        this.totalchips -= 5;
      }
    }
  }

  betten() {
    if (this.canbet === "True") {
      if (this.totalchips >= 10) {
        this.mybet += 10;
        this.totalchips -= 10;
      }
    }
  }

  clearbet() {
    if (this.canbet === "True") {
      if (this.mybet > 0) {
        this.totalchips += this.mybet;
        this.mybet = 0;
      }
    }
  }

  dealhand() {
    if (this.mybet === 0) {
      this.console3 = "Enter a bet to play!";
    } else {
      if (this.d2 !== 0 || this.bust === "True") {
        this.canbet = "False";
        this.candd = "True";
        this.bust = "False";
        this.p1 = this.drawcard(this.mysum);
        this.p2 = this.drawcard();
        this.d1 = this.drawcard();
        this.d2 = 0;
        this.dealerscards = this.d1 + ", ?";

        this.mycards = this.p1 + ", " + this.p2;
        this.console1 = "Dealer upcard is: " + this.d1;
        this.console2 = "Your total is: " + this.sumcards(this.mycards);
        this.console3 = "Hit, Stand, or Double Down?";
        this.canhit = "True";
        this.canstand = "True";

        //Case for if player has blackjack (pays 3:2)
        if (this.sumcards(this.mycards) === 21) {
          this.console2 = "You WON, you have Blackjack!";
          this.totalchips = this.totalchips + this.mybet * 1.5 + this.mybet;
          this.console3 =
            "You won " +
            (parseInt(this.mybet * 1.5, 10) + this.mybet) +
            " chips.  Another hand?";
          this.mybet = 0;
          this.canbet = "True";
          this.candd = "False";
          this.canhit = "False";
          this.canstand = "False";
          this.bust = "True";
        }
      }
    }
  }
  sumcards(cards) {
    var values = cards.split(", ");
    var i = 0;
    var sum = 0;
    for (i = 0; i < values.length; i++) {
      if (values[i] === "Ace") {
        sum = parseInt(sum, 10) + 11;
      } else if (
        values[i] === "Jack" ||
        values[i] === "Queen" ||
        values[i] === "King"
      ) {
        sum = parseInt(sum, 10) + 10;
      } else sum = parseInt(sum, 10) + parseInt(values[i], 10);
    }
    return sum;
  }
  hit() {
    if (this.bust === "False" && this.canhit === "True") {
      this.candd = "False";
      this.mycards = this.mycards + ", " + this.drawcard();
      this.mysum = this.sumcards(this.mycards);
      if (this.sumcards(this.mycards) > 21) {
        this.bust = "True";
        this.console2 =
          " You BUSTED with a total of: " + this.sumcards(this.mycards);
        this.console3 = "You lost " + this.mybet + " chips.  Another hand?";
        this.mybet = 0;
        this.canbet = "True";
        this.canhit = "False";
        this.canstand = "False";
      } else {
        this.console1 = "Dealer upcard is: " + this.d1;
        this.console2 = "Your total is: " + this.sumcards(this.mycards);
        this.console3 = "Hit or Stand?";
        this.canstand = "True";
      }
    }
  }
}

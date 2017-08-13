#include <iostream>

int main (){
    int num1, num2, num3, num4;
    int sum = 0;
    int prod = 1;
    int rem, quot;
    std::cout<<"Enter 4 integer numbers\n";
    std::cin>>num1>>num2>>num3>>num4;
    sum = num1 + num2;
    prod = num3 * num4;
    std::cout<<"Sum of first two numbers :: "<<sum<<"\n";
    std::cout<<"Product of last two numbers :: "<<prod<<"\n";
    if(sum >= prod ){
        quot = sum / prod;
        rem = sum % prod;
    }
    else{
        quot = prod / sum;
        rem = prod % sum;
    }
    std::cout<<"Remainder :: "<<rem<<"\n";
    std::cout<<"Quotient :: "<<quot<<"\n";
    return 0;
}
